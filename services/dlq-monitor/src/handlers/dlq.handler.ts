import { logger } from "shared";

export async function handleDLQMessage(payload: any, topic: string) {
  logger.warn(
    {
      eventId: payload.eventId,
      eventType: payload.eventType,
      orderId: payload.orderId,
      errorMessage: payload.errorMessage,
      retryCount: payload.retryCount,
      topic
    },
    "DLQ Message Received: Processing failure detected"
  );

  // Here you could add automated recovery logic, 
  // slack alerts, or push to a metrics system.
  // For now, we are monitoring and logging to confirm consumption.
}
