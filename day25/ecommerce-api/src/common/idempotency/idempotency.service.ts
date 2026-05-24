import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  // Hash request body để so sánh sau
  hashBody(body: unknown): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
  }

  // Kiểm tra key đã tồn tại chưa
  async checkKey(
    key: string,
    userId: string,
    bodyHash: string,
  ): Promise<{ exists: boolean; response?: unknown }> {
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { key },
    });

    if (!existing) {
      return { exists: false };
    }

    // Key tồn tại nhưng của user khác → 409
    if (existing.userId !== userId) {
      throw new ConflictException(
        'Idempotency key already used by another user',
      );
    }

    // Key tồn tại nhưng body khác → 409 sai ngữ cảnh
    if (existing.bodyHash !== bodyHash) {
      throw new ConflictException(
        'Idempotency key already used with different request body',
      );
    }

    // Key hết hạn → cho phép tạo mới
    if (existing.expiresAt < new Date()) {
      await this.prisma.idempotencyKey.delete({ where: { key } });
      return { exists: false };
    }

    // Key hợp lệ → trả lại response cũ
    return { exists: true, response: existing.response };
  }

  // Lưu key + response vào DB
  async saveKey(
    key: string,
    userId: string,
    bodyHash: string,
    response: unknown,
  ): Promise<void> {
    // Key hết hạn sau 24h
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.idempotencyKey.create({
      data: {
        key,
        userId,
        bodyHash,
        response: response as object,
        expiresAt,
      },
    });
  }
}
