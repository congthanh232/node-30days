import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { TelegramService } from '../telegram/telegram.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly telegramService: TelegramService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { traceId: string }>();

    const traceId = request.traceId || uuidv4();
    const { method, url } = request;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as { message: string | string[] };
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message || message;
      } else {
        message = exceptionResponse;
      }
      // Log lỗi HTTP thường
      this.logger.warn(
        `← ${method} ${url} ${status} [${traceId}] - ${message}`,
      );
    } else if (exception instanceof Error) {
      const isDev = process.env.NODE_ENV === 'development';
      this.logger.warn(
        `← ${method} ${url} ${status} [${traceId}] - ${exception.message}${
          isDev ? '\n' + (exception.stack ?? '') : ''
        }`,
      );
    }

    // Chỉ gửi Telegram khi lỗi 500 — lỗi nghiêm trọng cần alert ngay
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const alert = this.telegramService.formatErrorAlert({
        method,
        url,
        status,
        message,
        traceId,
        timestamp: new Date().toISOString(),
      });
      void this.telegramService.sendAlert(alert);
    }

    response.status(status).json(ApiResponse.error(status, message, traceId));
  }
}
