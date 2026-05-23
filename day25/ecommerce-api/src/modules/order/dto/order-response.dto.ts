import { Decimal } from '@prisma/client/runtime/library';

// DTO cho từng item trong response
export class OrderItemResponseDto {
  id!: string;
  productId!: string;
  quantity!: number;
  price!: number;
}

// DTO response của order
export class OrderResponseDto {
  id!: string;
  userId!: string;
  status!: string;
  totalPrice!: number;
  items!: OrderItemResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(order: {
    id: string;
    userId: string;
    status: string;
    totalPrice: Decimal;
    createdAt: Date;
    updatedAt: Date;
    items: {
      id: string;
      productId: string;
      quantity: number;
      price: Decimal;
    }[];
  }): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = order.id;
    dto.userId = order.userId;
    dto.status = order.status;
    dto.totalPrice = Number(order.totalPrice);
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    dto.items = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
    }));
    return dto;
  }
}
