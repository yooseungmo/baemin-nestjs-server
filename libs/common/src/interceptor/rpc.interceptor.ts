import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class RpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const res = {
          status: 'success',
          data,
        };

        console.log(res);

        return res;
      }),
      catchError((err) => {
        const res = {
          status: 'error',
          error: err,
        };

        console.log(res);

        return throwError(() => new RpcException(err));
      }),
    );
  }
}
