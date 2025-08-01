import morgan from 'morgan';
import { logger } from '../config/logger';
import { env } from '../config/env';

// Create a stream object for Morgan to write to
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Morgan format
const format = env.NODE_ENV === 'production' 
  ? 'combined' 
  : ':method :url :status :res[content-length] - :response-time ms';

export const loggerMiddleware = morgan(format, { stream });