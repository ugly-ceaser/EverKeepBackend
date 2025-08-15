import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const rateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS || 1000, // increase default burst
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // allow more attempts
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});