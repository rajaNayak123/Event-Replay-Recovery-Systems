import {
  BaseEvent,
  env,
  processingService,
  retryService,
  failedEventService,
  logger
} from "shared";

export async function handleOrderCreated(event: BaseEvent, sourceTopic: string, traceId?: string) {
  const retryCount = event.meta?.retryCount ?? 0;

  try {
    const result = await processingService.processOrderCreated(
      event as any,
      sourceTopic,
      "consumer-worker"
    );

    if (result.skipped) {
      logger.warn(
        { eventId: event.eventId, reason: result.reason, traceId },
        "Event skipped due to idempotency"
      );
    } else {
      logger.info(
        { eventId: event.eventId, orderId: (event as any).orderId, traceId },
        "Event processed successfully"
      );
    }
  } catch (error: any) {
    const nextRetryCount = retryCount + 1;

    logger.error(
      {
        eventId: event.eventId,
        orderId: (event as any).orderId,
        retryCount: nextRetryCount,
        error: error.message,
        traceId
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
            originalStream: sourceTopic
          }
        },
        nextRetryCount
      );

      logger.info({ eventId: event.eventId, nextRetryCount, traceId }, "Retry published to retry topic");
      return;
    }

    await failedEventService.persistFailure(
      event,
      sourceTopic,
      error.message,
      nextRetryCount
    );

    logger.error(
      { eventId: event.eventId, retryCount: nextRetryCount, traceId },
      "Event persisted as failed and sent to DLQ topic"
    );
  }
}