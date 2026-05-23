import {
  IsArray,
  IsInt,
  IsString,
  IsNotEmpty,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho từng item trong order
export class OrderItemDto {
  // ID của sản phẩm
  @IsString()
  @IsNotEmpty()
  productId!: string;

  // Số lượng — tối thiểu 1
  @IsInt()
  @Min(1)
  quantity!: number;
}

// DTO tạo order
export class CreateOrderDto {
  // Danh sách sản phẩm — tối thiểu 1 item
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // validate từng item trong array
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
