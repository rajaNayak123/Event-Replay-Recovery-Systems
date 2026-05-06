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
  let cursor = "0";
  do {
    const [next, keys] = await redis.scan(cursor, "MATCH", `${prefix}*`, "COUNT", 100);
    cursor = next;
    if (keys.length) await redis.del(...keys);
  } while (cursor !== "0");
}
};