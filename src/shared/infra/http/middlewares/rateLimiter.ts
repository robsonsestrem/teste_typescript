import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
  enableOfflineQueue: false,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip ?? 'unknown');

    return next();
  } catch (err) {
    if (err instanceof Error) {
      throw new AppError('Rate limiter unavailable.', 503);
    }

    throw new AppError('Too many requests.', 429);
  }
}
