import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

// Secret dùng để verify webhook — trong thực tế lấy từ .env
const WEBHOOK_SECRET = 'webhook-secret-key';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo payment intent — giả lập bước 1
  async createIntent(
    userId: string,
    dto: CreatePaymentDto,
  ): Promise<PaymentResponseDto & { webhookSignature: string }> {
    // Kiểm tra order tồn tại và thuộc về user
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order #${dto.orderId} not found`);
    }

    // Chỉ thanh toán được order PENDING
    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        `Order status is ${order.status}, only PENDING orders can be paid`,
      );
    }

    // Kiểm tra đã có payment chưa
    const existing = await this.prisma.payment.findUnique({
      where: { orderId: dto.orderId },
    });
    if (existing) {
      throw new BadRequestException('Payment already exists for this order');
    }

    // Tạo payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: order.totalPrice,
        status: 'PENDING',
      },
    });

    // Tạo webhook signature — giả lập Stripe signature
    const webhookSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payment.id)
      .digest('hex');

    return {
      ...PaymentResponseDto.fromEntity(payment),
      webhookSignature, // trả về để client dùng test webhook
    };
  }

  // Xác nhận thanh toán — giả lập bước 2
  async confirm(
    paymentId: string,
    userId: string,
  ): Promise<{ message: string; webhookPayload: object }> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment #${paymentId} not found`);
    }

    if (payment.order.userId !== userId) {
      throw new NotFoundException(`Payment #${paymentId} not found`);
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException(`Payment already ${payment.status}`);
    }

    // Tạo webhook payload — giả lập Stripe gửi về
    const webhookPayload = {
      event: 'payment.success',
      paymentId: payment.id,
      orderId: payment.orderId,
    };

    // Tạo signature
    const signature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payment.id)
      .digest('hex');

    return {
      message:
        'Payment confirmed! Use webhookPayload and signature to call /payments/webhook',
      webhookPayload,
      signature,
    } as { message: string; webhookPayload: object };
  }

  // Webhook handler — nhận event từ payment provider
  async handleWebhook(
    payload: { event: string; paymentId: string; orderId: string },
    signature: string,
  ): Promise<{ message: string }> {
    // Verify chữ ký
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payload.paymentId)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (payload.event === 'payment.success') {
      // Dùng transaction để cập nhật cả payment và order
      await this.prisma.$transaction([
        // Cập nhật payment → SUCCESS
        this.prisma.payment.update({
          where: { id: payload.paymentId },
          data: { status: 'SUCCESS' },
        }),
        // Cập nhật order → PAID
        this.prisma.order.update({
          where: { id: payload.orderId },
          data: { status: 'PAID' },
        }),
      ]);
    }

    return { message: 'Webhook processed successfully' };
  }

  // Lấy payment theo order
  async findByOrder(
    orderId: string,
    userId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, order: { userId } },
    });

    if (!payment) {
      throw new NotFoundException(`Payment for order #${orderId} not found`);
    }

    return PaymentResponseDto.fromEntity(payment);
  }
}
