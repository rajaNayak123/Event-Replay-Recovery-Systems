import { env } from "../config/env";
import { BaseEvent } from "../events/types";
import { logger } from "../logging/logger";
import { scheduledRetryService } from "./scheduled-retry.service";

export const retryService = {
  /**
   * Schedules a retry persistently.
   * Moving away from setTimeout to Redis ZSET ensures retries survive process restarts.
   */
  async scheduleRetry(event: BaseEvent, retryCount: number) {
    const delay = env.RETRY_BACKOFF_MS * retryCount;
    const scheduledAt = Date.now() + delay;
    
    logger.info(
      { eventId: event.eventId, retryCount, delayMs: delay, scheduledAt: new Date(scheduledAt) },
      "Scheduling persistent event retry"
    );

    await scheduledRetryService.schedule({
      event,
      retryCount,
      scheduledAt
    });
  }
};