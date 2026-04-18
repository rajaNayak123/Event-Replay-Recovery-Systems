import { redis } from "../redis/client";

export const cacheService = {
  async getJson<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },

  async setJson(key: string, value: unknown, ttlSeconds = 60) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },

  async del(key: string) {
    await redis.del(key);
  },

  async delByPrefix(prefix: string) {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length) {
      await redis.del(...keys);
    }
  }
};