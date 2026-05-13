import { 
  logger, 
  scheduledReplayService, 
  scheduledRetryService,
  publishKafkaMessage, 
  TOPICS,
  sleep
} from "shared";

const POLLING_INTERVAL_MS = 5000; // Increased frequency to 5s

async function processDueReplays() {
  try {
    const due = await scheduledReplayService.getDueReplays();
    
    if (due.length === 0) return;

    logger.info({ count: due.length }, "Processing due scheduled replays");

    for (const item of due) {
      try {
        // Atomic guard: Try to remove from Redis first to "claim" the task
        const removed = await scheduledReplayService.removeProcessed(item) as unknown as number;
        
        if (removed === 0) {
          // Already claimed by another instance
          continue;
        }

        await publishKafkaMessage(
          TOPICS.ORDER_REPLAY,
          item.event.eventId,
          {
            replayRequestId: item.replayRequestId,
            failedEventId: item.failedEventId,
            requestedBy: item.requestedBy,
            requestedAt: new Date().toISOString(),
            event: item.event,
            scheduled: true
          },
          {
            replayRequestId: item.replayRequestId,
            eventId: item.event.eventId,
            replay: "true",
            scheduled: "true"
          }
        );

        logger.info({ replayRequestId: item.replayRequestId }, "Scheduled replay published");
      } catch (err) {
        logger.error({ replayRequestId: item.replayRequestId, error: err }, "Failed replay processing");
      }
    }
  } catch (error) {
    logger.error({ error }, "Error in scheduled replay polling");
  }
}

async function processDueRetries() {
  try {
    const due = await scheduledRetryService.getDueRetries();
    
    if (due.length === 0) return;

    logger.info({ count: due.length }, "Processing due scheduled retries");

    for (const item of due) {
      try {
        // Atomic guard: Try to remove from Redis first to "claim" the task
        const removed = await scheduledRetryService.removeProcessed(item) as unknown as number;

        if (removed === 0) {
          // Already claimed by another instance
          continue;
        }

        await publishKafkaMessage(
          TOPICS.ORDER_RETRY,
          item.event.eventId,
          {
            ...item.event,
            meta: {
              ...item.event.meta,
              retryCount: item.retryCount
            }
          },
          {
            eventId: item.event.eventId,
            eventType: item.event.eventType,
            retryCount: String(item.retryCount),
            persistent: "true"
          }
        );

        logger.info({ eventId: item.event.eventId, retryCount: item.retryCount }, "Scheduled retry published");
      } catch (err) {
        logger.error({ eventId: item.event.eventId, error: err }, "Failed retry processing");
      }
    }
  } catch (error) {
    logger.error({ error }, "Error in scheduled retry polling");
  }
}

async function main() {
  logger.info("Scheduled Task Worker started (Replays + Retries)");
  
  while (true) {
    await Promise.all([
      processDueReplays(),
      processDueRetries()
    ]);
    await sleep(POLLING_INTERVAL_MS);
  }
}

main().catch(err => {
  logger.error({ err }, "Scheduled Replay Worker crashed");
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down scheduled worker...");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down scheduled worker...");
  process.exit(0);
});
