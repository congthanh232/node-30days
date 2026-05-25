import { IsString, IsNotEmpty } from 'class-validator';

// DTO tạo payment intent
export class CreatePaymentDto {
  // ID của order muốn thanh toán
  @IsString()
  @IsNotEmpty()
  orderId!: string;
}
