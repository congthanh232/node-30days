import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// DTO tạo payment intent
export class CreatePaymentDto {
  @ApiProperty({ example: 'abc-123', description: 'Order ID to pay' })
  // ID của order muốn thanh toán
  @IsString()
  @IsNotEmpty()
  orderId!: string;
}
