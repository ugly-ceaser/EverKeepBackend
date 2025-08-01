
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env } from './env'; // Adjust path if necessary

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Console log format
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// File log format (JSON + stack trace support)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
);

// Winston logger instance
export const logger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'backend-api' },
  transports: [
    ...(env.NODE_ENV === 'development'
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),

    // Error log (rotates daily)
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: env.LOG_MAX_SIZE || '20m',
      maxFiles: env.LOG_MAX_FILES || '14d',
      zippedArchive: true,
    }),

    // Combined log (rotates daily)
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: env.LOG_MAX_SIZE || '20m',
      maxFiles: env.LOG_MAX_FILES || '14d',
      zippedArchive: true,
    }),
  ],
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1); // Optional: gracefully shutdown instead
});


