import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo sản phẩm mới
  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock ?? 0,
        category: dto.category,
      },
    });
    return ProductResponseDto.fromEntity(product);
  }

  // Lấy danh sách sản phẩm có pagination + filter + sort
  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const skip = (page - 1) * limit;

    // Điều kiện filter
    const where: Prisma.ProductWhereInput = {
      isActive: query.isActive ?? true,
    };

    // Filter theo category
    if (query.category) {
      where.category = query.category;
    }

    // Search theo tên
    if (query.search) {
      where.name = { contains: query.search };
    }

    // Sort
    const orderBy = {
      [query.sort ?? 'createdAt']: query.order ?? 'desc',
    };

    // Chạy 2 query song song
    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((p) => ProductResponseDto.fromEntity(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy 1 sản phẩm theo id
  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return ProductResponseDto.fromEntity(product);
  }

  // Cập nhật sản phẩm
  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // Kiểm tra tồn tại
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price !== undefined ? dto.price : undefined,
      },
    });
    return ProductResponseDto.fromEntity(product);
  }

  // Xóa sản phẩm
  async remove(id: string): Promise<{ message: string }> {
    // Kiểm tra tồn tại
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });
    return { message: `Product #${id} deleted successfully` };
  }
}
