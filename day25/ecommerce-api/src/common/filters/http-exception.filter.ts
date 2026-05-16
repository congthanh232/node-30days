import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { traceId: string }>();

    const traceId = request.traceId || uuidv4();

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
      // Log đầy đủ ở server nhưng KHÔNG trả ra ngoài
      this.logger.error(
        `Unhandled error [${traceId}]: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json(ApiResponse.error(status, message, traceId));
  }
}
