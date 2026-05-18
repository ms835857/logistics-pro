import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        // If data already contains message, use it; otherwise use generic
        const message = data && data.message ? data.message : 'Success';
        
        // Some handlers might return exactly { message, data } so we extract them
        const responseData = data && data.data !== undefined ? data.data : data;

        // If the return object is explicitly skipping the interceptor formatting (e.g. { _skip_format: true })
        if (data && data._skip_format) {
            delete data._skip_format;
            return data;
        }

        return {
          success: true,
          message: message,
          data: responseData,
          statusCode,
        };
      }),
    );
  }
}
