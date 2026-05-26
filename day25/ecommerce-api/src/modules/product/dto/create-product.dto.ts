import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO đầu vào khi tạo sản phẩm mới
export class CreateProductDto {
  @ApiProperty({ example: 'Áo thun nam', description: 'Product name' })
  // Tên sản phẩm — bắt buộc
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Áo thun cotton cao cấp',
    description: 'Product description',
  })
  // Mô tả — không bắt buộc
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150000, description: 'Product price', minimum: 0 })
  // Giá — phải là số dương
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Stock quantity',
    minimum: 0,
    default: 0,
  })
  // Số lượng tồn kho — phải là số nguyên dương
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number = 0;

  @ApiProperty({ example: 'fashion', description: 'Product category' })
  // Danh mục — bắt buộc
  @IsString()
  @IsNotEmpty()
  category!: string;
}
