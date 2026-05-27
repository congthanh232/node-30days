import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor(private readonly config: ConfigService) {
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
    this.chatId = this.config.get<string>('TELEGRAM_CHAT_ID') ?? '';
  }

  async sendAlert(message: string): Promise<void> {
    // Không có token thì bỏ qua
    if (!this.botToken || !this.chatId) {
      this.logger.warn('Telegram config missing, skipping alert');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML', // hỗ trợ bold, italic
        }),
      });

      if (!response.ok) {
        this.logger.error(`Telegram API error: ${response.statusText}`);
      }
    } catch (error) {
      // Không throw — lỗi Telegram không được ảnh hưởng app
      this.logger.error('Failed to send Telegram alert', error);
    }
  }

  // Format message lỗi đẹp
  formatErrorAlert(params: {
    method: string;
    url: string;
    status: number;
    message: string;
    traceId: string;
    timestamp: string;
  }): string {
    return `
🚨 <b>ERROR ALERT</b>
━━━━━━━━━━━━━━━
🔴 <b>Status:</b> ${params.status}
📍 <b>Route:</b> ${params.method} ${params.url}
💬 <b>Message:</b> ${params.message}
🔑 <b>TraceId:</b> <code>${params.traceId}</code>
⏰ <b>Time:</b> ${params.timestamp}
━━━━━━━━━━━━━━━
    `.trim();
  }
}
