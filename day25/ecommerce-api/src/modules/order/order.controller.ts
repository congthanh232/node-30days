import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserType } from '../../common/decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Order')
@ApiBearerAuth()
// Tất cả route cần đăng nhập
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create new order' })
  @ApiHeader({
    name: 'idempotency-key',
    description: 'Unique key to prevent duplicate orders',
    required: false,
  })
  // POST /api/v1/orders — tạo order mới
  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: CurrentUserType,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.orderService.create(user.userId, dto, idempotencyKey);
  }

  @ApiOperation({ summary: 'Get list of orders for current user' })
  // GET /api/v1/orders — lấy danh sách order của user
  @Get()
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.orderService.findAll(user.userId);
  }

  @ApiOperation({ summary: 'Get order by id' })
  // GET /api/v1/orders/:id
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.orderService.findOne(id, user.userId);
  }

  @ApiOperation({ summary: 'Cancel order' })
  // PATCH /api/v1/orders/:id/cancel — huỷ order
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    return this.orderService.cancel(id, user.userId);
  }
}
