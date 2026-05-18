import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho query params
export class QueryUserDto {
  // Trang hiện tại — mặc định là 1
  @IsOptional()
  @Type(() => Number) // chuyển string "1" → number 1
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

  // Tìm kiếm theo tên hoặc email
  @IsOptional()
  @IsString()
  search?: string;

  // Sắp xếp theo field nào — mặc định createdAt
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';
}
