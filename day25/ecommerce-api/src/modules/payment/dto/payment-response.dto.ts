import { Decimal } from '@prisma/client/runtime/library';

export class PaymentResponseDto {
  id!: string;
  orderId!: string;
  amount!: number;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(payment: {
    id: string;
    orderId: string;
    amount: Decimal;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentResponseDto {
    const dto = new PaymentResponseDto();
    dto.id = payment.id;
    dto.orderId = payment.orderId;
    dto.amount = Number(payment.amount);
    dto.status = payment.status;
    dto.createdAt = payment.createdAt;
    dto.updatedAt = payment.updatedAt;
    return dto;
  }
}
