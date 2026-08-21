import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

// Global rate limiter - applies to all requests
// Uses Redis for distributed rate limiting across multiple instances
export const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

// Stricter rate limiter for sensitive routes (e.g., login, register)
// Applies limits ID-wise (per email) to avoid locking out entire shared IPs
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes cooldown time
  max: 15, // Limit each ID/email to 15 requests per window
  keyGenerator: (req) => {
    // If email is provided in body, use it as the rate limit key. Otherwise fallback to IP.
    if (req.body && req.body.email) {
      return `auth_${req.body.email.toLowerCase()}`;
    }
    return req.ip || 'unknown-ip';
  },
  message: { success: false, error: { message: 'Too many authentication attempts, please try again after 5 minutes' } }
});

// Stricter rate limiter for POST/PUT/DELETE
export const mutationLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many creation/update requests from this IP, please try again later',
      code: 'MUTATION_RATE_LIMIT_EXCEEDED'
    }
  }
});
