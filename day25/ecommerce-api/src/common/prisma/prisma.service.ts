import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Ngưỡng query chậm — quá 100ms thì log warning
const SLOW_QUERY_THRESHOLD = 100;
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' }, // bắt event query
      ],
    });

    // Lắng nghe event query
    this.$on('query' as never, (e: { query: string; duration: number }) => {
      if (e.duration >= SLOW_QUERY_THRESHOLD) {
        this.logger.warn(`🐌 Slow query (${e.duration}ms): ${e.query}`);
      }
    });
  }

  async onModuleInit() {
    // Kết nối DB khi app khởi động
    await this.$connect();
  }

  async onModuleDestroy() {
    // Đóng kết nối DB khi app tắt
    await this.$disconnect();
  }
}
