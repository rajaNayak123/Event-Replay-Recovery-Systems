import { redis } from "../redis/client";
import { cacheKeys } from "../cache/cache-keys";
import { logger } from "../logging/logger";

export interface ScheduledReplayData {
  replayRequestId: string;
  failedEventId: string;
  requestedBy: string;
  event: any;
  scheduledAt: number; // Unix timestamp in ms
}

export const scheduledReplayService = {
  async schedule(data: ScheduledReplayData) {
    const key = cacheKeys.scheduledReplayQueue();
    const payload = JSON.stringify(data);
    
    await redis.zadd(key, data.scheduledAt, payload);
    
    logger.info(
      { replayRequestId: data.replayRequestId, scheduledAt: new Date(data.scheduledAt) },
      "Replay scheduled in Redis sorted set"
    );
  },

  async getDueReplays(now: number = Date.now()): Promise<ScheduledReplayData[]> {
    const key = cacheKeys.scheduledReplayQueue();
    
    // Get all members with score between 0 and now
    const rawDue = await redis.zrangebyscore(key, 0, now);
    
    if (!rawDue || rawDue.length === 0) {
      return [];
    }

    return rawDue.map(r => JSON.parse(r) as ScheduledReplayData);
  },

  async removeProcessed(data: ScheduledReplayData) {
    const key = cacheKeys.scheduledReplayQueue();
    const payload = JSON.stringify(data);
    await redis.zrem(key, payload);
  }
};
