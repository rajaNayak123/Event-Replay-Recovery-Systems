import {
  BaseEvent,
  STREAMS,
  env,
  processingService,
  retryService,
  failedEventService,
  logger
} from "shared";

export async function handleOrderCreated(event: BaseEvent, sourceStream: string) {
  const retryCount = event.meta?.retryCount ?? 0;

  try {
    const result = await processingService.processOrderCreated(
      event as any,
      sourceStream,
      "consumer-worker"
    );

    if (result.skipped) {
      logger.warn(
        { eventId: event.eventId, reason: result.reason },
        "Event skipped due to idempotency"
      );
    } else {
      logger.info({ eventId: event.eventId, orderId: event.orderId }, "Event processed successfully");
    }
  } catch (error: any) {
    const nextRetryCount = retryCount + 1;

    logger.error(
      {
        eventId: event.eventId,
        orderId: event.orderId,
        retryCount: nextRetryCount,
        error: error.message
      },
      "Event processing failed"
    );

    if (nextRetryCount <= env.MAX_RETRIES) {
      await retryService.scheduleRetry(
        {
          ...event,
          meta: {
            ...event.meta,
            retryCount: nextRetryCount,
            originalStream: sourceStream
          }
        },
        nextRetryCount
      );
      logger.info({ eventId: event.eventId, nextRetryCount }, "Retry scheduled");
      return;
    }

    await failedEventService.persistFailure(
      event,
      sourceStream,
      error.message,
      nextRetryCount
    );

    logger.error(
      { eventId: event.eventId, retryCount: nextRetryCount },
      "Event moved to failed_events and DLQ"
    );
  }
}