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
import { ApiProperty } from '@nestjs/swagger';

// DTO cho từng item trong order
export class OrderItemDto {
  @ApiProperty({ example: 'abc-123', description: 'Product ID' })
  // ID của sản phẩm
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, description: 'Quantity', minimum: 1 })
  // Số lượng — tối thiểu 1
  @IsInt()
  @Min(1)
  quantity!: number;
}

// DTO tạo order
export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of items in order',
    example: [{ productId: 'abc-123', quantity: 2 }],
  })
  // Danh sách sản phẩm — tối thiểu 1 item
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // validate từng item trong array
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
