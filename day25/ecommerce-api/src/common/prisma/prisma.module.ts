import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() — dùng được ở mọi module mà không cần import lại
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
