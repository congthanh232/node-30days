import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

// Tất cả route bắt đầu bằng /api/v1/users
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /api/v1/users — tạo user mới
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  // GET /api/v1/users?page=1&limit=10&search=john
  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  // GET /api/v1/users/:id — lấy 1 user theo id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
