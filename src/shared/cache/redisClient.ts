import Redis from 'ioredis';
import cacheConfig from '@config/cache';

const redisClient = new Redis(cacheConfig.config.redis);

redisClient.on('error', (err: Error) => {
  console.error(`Redis error: ${err.message}`);
});

export default redisClient;
