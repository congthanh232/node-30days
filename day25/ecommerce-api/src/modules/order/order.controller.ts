import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserType } from '../../common/decorators/current-user.decorator';

// Tất cả route cần đăng nhập
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /api/v1/orders — tạo order mới
  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: CurrentUserType) {
    return this.orderService.create(user.userId, dto);
  }

  // GET /api/v1/orders — lấy danh sách order của user
  @Get()
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.orderService.findAll(user.userId);
  }

  // GET /api/v1/orders/:id
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.orderService.findOne(id, user.userId);
  }

  // PATCH /api/v1/orders/:id/cancel — huỷ order
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.orderService.cancel(id, user.userId);
  }
}
