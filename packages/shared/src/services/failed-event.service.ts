import { failedEventsCacheService } from "../cache/failed-events-cache.service";
import { BaseEvent } from "../events/types";
import { publishKafkaMessage } from "../kafka/producer";
import { TOPICS } from "../kafka/topics";
import { failedEventRepository } from "../repositories/failed-event.repository";

export const failedEventService = {
  async persistFailure(
    event: BaseEvent,
    topicName: string,
    errorMessage: string,
    retryCount: number
  ) {
    const failed = await failedEventRepository.create({
      eventId: event.eventId,
      eventType: event.eventType,
      tenantId: event.tenantId,
      streamName: topicName,
      orderId: event.orderId,
      originalPayload: event,
      errorMessage,
      retryCount
    });

    await publishKafkaMessage(
      TOPICS.ORDER_DLQ,
      event.eventId,
      {
        failedEventId: failed.id,
        eventId: event.eventId,
        eventType: event.eventType,
        orderId: event.orderId,
        tenantId: event.tenantId,
        retryCount,
        errorMessage,
        originalPayload: event,
        failedAt: new Date().toISOString()
      },
      {
        eventId: event.eventId,
        eventType: event.eventType,
        failureType: "PROCESSING_ERROR"
      }
    );

    await failedEventsCacheService.invalidateForFailedEvent(failed.id);

    return failed;
  }
};