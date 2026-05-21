import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO đầu vào khi tạo sản phẩm mới
export class CreateProductDto {
  // Tên sản phẩm — bắt buộc
  @IsString()
  @IsNotEmpty()
  name!: string;

  // Mô tả — không bắt buộc
  @IsOptional()
  @IsString()
  description?: string;

  // Giá — phải là số dương
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  // Số lượng tồn kho — phải là số nguyên dương
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number = 0;

  // Danh mục — bắt buộc
  @IsString()
  @IsNotEmpty()
  category!: string;
}
