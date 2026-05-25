import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserType } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // POST /api/v1/payments — tạo payment intent
  @UseGuards(JwtAuthGuard)
  @Post()
  createIntent(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.paymentService.createIntent(user.userId, dto);
  }

  // POST /api/v1/payments/:id/confirm — xác nhận thanh toán
  @UseGuards(JwtAuthGuard)
  @Post(':id/confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.paymentService.confirm(id, user.userId);
  }

  // POST /api/v1/payments/webhook — nhận event từ payment provider
  // Không cần auth vì đây là endpoint public cho Stripe gọi vào
  @Post('webhook')
  handleWebhook(
    @Body() payload: { event: string; paymentId: string; orderId: string },
    @Headers('x-webhook-signature') signature: string,
  ) {
    return this.paymentService.handleWebhook(payload, signature);
  }

  // GET /api/v1/payments/order/:orderId
  @UseGuards(JwtAuthGuard)
  @Get('order/:orderId')
  findByOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.paymentService.findByOrder(orderId, user.userId);
  }
}
