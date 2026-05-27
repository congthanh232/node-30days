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

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');

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
    } else if (exception instanceof Error) {
      this.logger.error(
        `← ${method} ${url} ${status} [${traceId}] - ${exception.message}`,
        exception.stack,
      );
    }

    // Log tất cả lỗi
    this.logger.warn(`← ${method} ${url} ${status} [${traceId}] - ${message}`);

    response.status(status).json(ApiResponse.error(status, message, traceId));
  }
}
