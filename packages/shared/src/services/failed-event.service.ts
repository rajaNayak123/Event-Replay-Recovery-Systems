import { failedEventRepository } from "../repositories/failed-event.repository";
import { publishToStream } from "../redis/publisher";
import { STREAMS } from "../constants/streams";
import { BaseEvent } from "../events/types";

export const failedEventService = {
  async persistFailure(event: BaseEvent, streamName: string, errorMessage: string, retryCount: number) {
    const failed = await failedEventRepository.create({
      eventId: event.eventId,
      eventType: event.eventType,
      tenantId: event.tenantId,
      streamName,
      orderId: event.orderId,
      originalPayload: event,
      errorMessage,
      retryCount
    });

    await publishToStream(STREAMS.DLQ, {
      failedEventId: failed.id,
      eventId: event.eventId,
      eventType: event.eventType,
      orderId: event.orderId,
      tenantId: event.tenantId,
      retryCount,
      errorMessage,
      originalPayload: event,
      failedAt: new Date().toISOString()
    });

    return failed;
  }
};