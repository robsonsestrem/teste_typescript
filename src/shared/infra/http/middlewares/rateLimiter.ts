import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import redisClient from '@shared/cache/redisClient';

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
