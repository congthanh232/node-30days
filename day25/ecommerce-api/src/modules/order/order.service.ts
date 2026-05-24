import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IdempotencyService } from '../../common/idempotency/idempotency.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  // Tạo order mới — dùng transaction
  async create(
    userId: string,
    dto: CreateOrderDto,
    idempotencyKey?: string,
  ): Promise<unknown> {
    // Nếu có idempotency key → kiểm tra trước
    if (idempotencyKey) {
      const bodyHash = this.idempotencyService.hashBody(dto);
      const { exists, response } = await this.idempotencyService.checkKey(
        idempotencyKey,
        userId,
        bodyHash,
      );

      // Key đã tồn tại → trả response cũ luôn
      if (exists) return response;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      // Bước 1: Validate từng product và tính total
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        // Product không tồn tại → throw lỗi → rollback toàn bộ
        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found`);
        }

        // Không đủ stock → throw lỗi → rollback toàn bộ
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Product "${product.name}" only has ${product.stock} items in stock`,
          );
        }

        totalPrice += Number(product.price) * item.quantity;
      }

      // Bước 2: Tạo Order
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'PENDING',
          items: {
            create: await Promise.all(
              dto.items.map(async (item) => {
                const product = await tx.product.findUnique({
                  where: { id: item.productId },
                });
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: Number(product!.price),
                };
              }),
            ),
          },
        },
        include: { items: true },
      });

      // Bước 3: Trừ stock từng sản phẩm
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return OrderResponseDto.fromEntity(order);
    });

    // Lưu key + response vào DB sau khi xử lý xong
    if (idempotencyKey) {
      const bodyHash = this.idempotencyService.hashBody(dto);
      await this.idempotencyService.saveKey(
        idempotencyKey,
        userId,
        bodyHash,
        result,
      );
    }

    return result;
  }

  // Lấy danh sách order của user
  async findAll(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => OrderResponseDto.fromEntity(o));
  }

  // Lấy 1 order theo id
  async findOne(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return OrderResponseDto.fromEntity(order);
  }

  // Huỷ order
  async cancel(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}`,
      );
    }

    // Dùng transaction để huỷ order và hoàn stock
    return this.prisma.$transaction(async (tx) => {
      // Hoàn stock từng sản phẩm
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Cập nhật status
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { items: true },
      });

      return OrderResponseDto.fromEntity(updated);
    });
  }
}
