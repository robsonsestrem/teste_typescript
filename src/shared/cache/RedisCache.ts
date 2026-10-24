import redisClient from './redisClient';

class RedisCache {
  public async save(key: string, value: unknown): Promise<void> {
    await redisClient.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export default new RedisCache();
