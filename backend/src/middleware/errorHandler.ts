import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const requestId = (req as any).id; // assigned by requestLogger

  // Log the error
  logger.error('Unhandled Exception', {
    requestId,
    method: req.method,
    url: req.url,
    statusCode,
    error: err.message,
    stack: err.stack,
  });

  // Prepare response
  const response: any = {
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : err.message,
      requestId,
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    if (statusCode === 500) {
      response.error.message = err.message; // Expose original message in dev
    }
  }

  res.status(statusCode).json(response);
};
