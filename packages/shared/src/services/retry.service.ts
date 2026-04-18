import { env } from "../config/env";
import { BaseEvent } from "../events/types";
import { publishKafkaMessage } from "../kafka/producer";
import { TOPICS } from "../kafka/topics";
import { sleep } from "../utils/sleep";

export const retryService = {
  async scheduleRetry(event: BaseEvent, retryCount: number) {
    const delay = env.RETRY_BACKOFF_MS * retryCount;
    await sleep(delay);

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
  }
};