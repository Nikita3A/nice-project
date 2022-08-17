import { Inject, Injectable, LoggerService } from '@nestjs/common';
import PinoLogger from 'pino'
import { ASYNC_STORAGE } from './logger.constants';
import { AsyncLocalStorage } from 'async_hooks';

const pino = PinoLogger({
    transport: {
      target: 'pino-pretty'
    },
});

@Injectable()
export class PinoLoggerService implements LoggerService {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  private getMessage(message: any, context?: string) {
    return context ? `[ ${context} ] ${message}` : message;
  }

  error(message: any, trace?: string, context?: string, error?: Error): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    const data = this.asyncStorage.getStore()?.get('data');
    pino.error({ 'traceId': traceId, 'data': data, 'error': error }, this.getMessage(message, context));
    if (trace) {
      pino.error(trace);
    }
  }

  log(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    const data = this.asyncStorage.getStore()?.get('data');
    pino.info({ 'traceId': traceId, 'data': data }, this.getMessage(message, context));
  }

  warn(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    const data = this.asyncStorage.getStore()?.get('data');
    pino.warn({ 'traceId': traceId, 'data': data }, this.getMessage(message, context));
  }
}
