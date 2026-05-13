import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../logging/logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  reconnectOnError: (err) => err.message.includes("READONLY")
});

redis.on("error", (error) => {
  logger.error({ error }, "Redis connection error");
});