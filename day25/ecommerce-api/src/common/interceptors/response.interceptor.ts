import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Tạo traceId cho mỗi request
    const traceId = uuidv4();
    (request as Request & { traceId: string }).traceId = traceId;

    // Gắn traceId vào response header
    response.setHeader('X-Trace-Id', traceId);

    return next.handle().pipe(
      map((data: unknown) => {
        if (data instanceof ApiResponse) return data;
        return ApiResponse.success(data, traceId);
      }),
    );
  }
}
