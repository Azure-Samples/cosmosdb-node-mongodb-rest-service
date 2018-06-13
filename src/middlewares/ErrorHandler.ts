import { logger } from 'config/winston';
import { NextFunction, Request, Response } from 'express';
import * as status from 'http-status';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, _next: NextFunction) {
    if (!(error instanceof HttpError) || error.httpCode >= status.INTERNAL_SERVER_ERROR) {
      logger.error(error.message);
    }
    res.status(error.httpCode || status.INTERNAL_SERVER_ERROR);
    res.json(error);
  }
}
