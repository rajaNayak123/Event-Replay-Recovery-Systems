import { env } from "../config/env";
import { BaseEvent } from "../events/types";
import { publishKafkaMessage } from "../kafka/producer";
import { TOPICS } from "../kafka/topics";
import { logger } from "../logging/logger";

export const retryService = {
  /**
   * Schedules a retry without blocking the caller's event loop.
   * Awaiting a sleep in a Kafka consumer blocks the partition's processing loop.
   */
  async scheduleRetry(event: BaseEvent, retryCount: number) {
    const delay = env.RETRY_BACKOFF_MS * retryCount;
    
    logger.info(
      { eventId: event.eventId, retryCount, delayMs: delay },
      "Scheduling event retry in background"
    );

    // Use setTimeout to execute the retry publication after the delay without blocking the event loop
    setTimeout(async () => {
      try {
        await publishKafkaMessage(
          TOPICS.ORDER_RETRY,
          event.eventId,
          {
            ...event,
            meta: {
              ...event.meta,
              retryCount
            }
          },
          {
            eventId: event.eventId,
            eventType: event.eventType,
            retryCount: String(retryCount)
          }
        );
        logger.info({ eventId: event.eventId, retryCount }, "Background retry published successfully");
      } catch (error) {
        logger.error(
          { error, eventId: event.eventId, retryCount },
          "Failed to publish background retry"
        );
      }
    }, delay);
  }
};