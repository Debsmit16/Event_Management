import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';
import logger from '../utils/logger';

// Add requestId to Express Request interface
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

// Middleware to assign a unique ID to each request
export const assignRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  // Add to response headers for tracking
  res.setHeader('X-Request-Id', req.id);
  next();
};

// Custom Morgan format that includes the request ID
morgan.token('req-id', (req: Request) => req.id);

const morganFormat = ':req-id :remote-addr - :method :url :status :res[content-length] - :response-time ms';

// Setup Morgan to write to Winston stream
export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      // Morgan adds a newline, so we trim it
      logger.http(message.trim());
    },
  },
});
