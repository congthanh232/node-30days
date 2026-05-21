import { Decimal } from '@prisma/client/runtime/library';

// DTO đầu ra — định nghĩa những gì trả về cho client
export class ProductResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  price!: number;
  stock!: number;
  category!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(product: {
    id: string;
    name: string;
    description: string | null;
    price: Decimal;
    stock: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.name = product.name;
    dto.description = product.description;
    // Convert Decimal → number để JSON serialize đúng
    dto.price = Number(product.price);
    dto.stock = product.stock;
    dto.category = product.category;
    dto.isActive = product.isActive;
    dto.createdAt = product.createdAt;
    dto.updatedAt = product.updatedAt;
    return dto;
  }
}
