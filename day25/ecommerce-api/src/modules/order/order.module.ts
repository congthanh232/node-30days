import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IdempotencyService } from 'src/common/idempotency/idempotency.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, IdempotencyService],
})
export class OrderModule {}
