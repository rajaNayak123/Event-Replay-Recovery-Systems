import { redis } from "../redis/client";
import { cacheKeys } from "../cache/cache-keys";
import { logger } from "../logging/logger";
import { BaseEvent } from "../events/types";

export interface ScheduledRetryData {
  event: BaseEvent;
  retryCount: number;
  scheduledAt: number; // Unix timestamp in ms
}

export interface ScheduledRetryService {
  schedule(data: ScheduledRetryData): Promise<void>;
  getDueRetries(now?: number): Promise<ScheduledRetryData[]>;
  removeProcessed(data: ScheduledRetryData): Promise<number>;
}

export const scheduledRetryService: ScheduledRetryService = {
  async schedule(data: ScheduledRetryData) {
    const key = cacheKeys.scheduledRetryQueue();
    const payload = JSON.stringify(data);
    
    await redis.zadd(key, data.scheduledAt, payload);
    
    logger.info(
      { eventId: data.event.eventId, retryCount: data.retryCount, scheduledAt: new Date(data.scheduledAt) },
      "Retry scheduled in Redis (persistent)"
    );
  },

  async getDueRetries(now: number = Date.now()): Promise<ScheduledRetryData[]> {
    const key = cacheKeys.scheduledRetryQueue();
    
    const rawDue = await redis.zrangebyscore(key, 0, now);
    
    if (!rawDue || rawDue.length === 0) {
      return [];
    }

    return rawDue.map(r => JSON.parse(r) as ScheduledRetryData);
  },

  async removeProcessed(data: ScheduledRetryData): Promise<number> {
    const key = cacheKeys.scheduledRetryQueue();
    const payload = JSON.stringify(data);
    return await redis.zrem(key, payload);
  }
};
