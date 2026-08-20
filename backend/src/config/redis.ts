import Redis from 'ioredis';
import { env } from './env';
import logger from '../utils/logger';

// Create a Redis instance
// Connect to Redis on localhost for local development or REDIS_URL for production
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required for some rate limiters
  enableReadyCheck: false,
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis successfully');
});
