import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Kết nối DB khi app khởi động
    await this.$connect();
  }

  async onModuleDestroy() {
    // Đóng kết nối DB khi app tắt
    await this.$disconnect();
  }
}
