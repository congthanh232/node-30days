import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// DTO cho query params — GET /api/v1/products?page=1&limit=10&search=áo&category=fashion
export class QueryProductDto {
  // Trang hiện tại — mặc định 1
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  // Số lượng mỗi trang — mặc định 10, tối đa 100
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Tìm kiếm theo tên sản phẩm
  @IsOptional()
  @IsString()
  search?: string;

  // Filter theo danh mục
  @IsOptional()
  @IsString()
  category?: string;

  // Filter theo trạng thái — mặc định chỉ lấy sản phẩm đang bán
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  isActive?: boolean = true;

  // Sắp xếp theo field nào — mặc định createdAt
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  // Thứ tự sắp xếp — asc hoặc desc
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
