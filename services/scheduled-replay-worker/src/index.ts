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

        await scheduledReplayService.removeProcessed(item);
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

        await scheduledRetryService.removeProcessed(item);
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
