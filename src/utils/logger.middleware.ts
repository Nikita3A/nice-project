import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {asyncLocalStorage} from '../logger/logger.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers['x-request-id'] || uuidv4();
    const body = req.body;
    const endpoint = req.params[0];

    const data = {body, endpoint};
    const store = new Map(); // .set('traceIdAndData', traceIdAndData);
    store.set('traceId', traceId);
    store.set('data', data);
    asyncLocalStorage.run(store, () => {
      next();
    });
  }
}
