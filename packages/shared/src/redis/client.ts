import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../logging/logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});

redis.on("error", (error) => {
  logger.error({ error }, "Redis connection error");
});