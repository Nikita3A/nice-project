import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";
import * as Sentry from '@sentry/minimal';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
        .handle()
        .pipe(
            catchError((err) => {
                this.logger.error('Intercepted error', err);
                Sentry.captureException(err);
                return throwError(() => err);
            }),
        );
    }
}