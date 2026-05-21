import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO đầu vào khi cập nhật sản phẩm — tất cả field đều optional
export class UpdateProductDto {
  // Tên sản phẩm
  @IsOptional()
  @IsString()
  name?: string;

  // Mô tả
  @IsOptional()
  @IsString()
  description?: string;

  // Giá
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  // Số lượng tồn kho
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  // Danh mục
  @IsOptional()
  @IsString()
  category?: string;

  // Trạng thái còn bán hay không
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
