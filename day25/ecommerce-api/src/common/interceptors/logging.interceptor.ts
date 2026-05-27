import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { traceId: string }>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url } = request;
    const traceId = request.traceId || 'unknown';
    const startTime = Date.now();

    // Log request vào
    this.logger.log(`→ ${method} ${url} [${traceId}]`);

    return next.handle().pipe(
      tap({
        // Log response ra — thành công
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.logger.log(
            `← ${method} ${url} ${statusCode} ${duration}ms [${traceId}]`,
          );
        },
        // Log response ra — lỗi
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `← ${method} ${url} ERROR ${duration}ms [${traceId}] - ${error.message}`,
          );
        },
      }),
    );
  }
}
