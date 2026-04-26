import { 
  logger, 
  scheduledReplayService, 
  publishKafkaMessage, 
  TOPICS,
  sleep
} from "shared";

const POLLING_INTERVAL_MS = 10000; // 10 seconds

async function processDueReplays() {
  try {
    const due = await scheduledReplayService.getDueReplays();
    
    if (due.length === 0) {
      return;
    }

    logger.info({ count: due.length }, "Processing due scheduled replays");

    for (const item of due) {
      try {
        // Publish to Kafka exactly as the immediate replay would
        await publishKafkaMessage(
          TOPICS.ORDER_REPLAY,
          item.event.eventId, // Use original eventId as key
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

        // Remove from Redis after successful publication
        await scheduledReplayService.removeProcessed(item);
        
        logger.info(
          { replayRequestId: item.replayRequestId }, 
          "Scheduled replay published and removed from queue"
        );
      } catch (err) {
        logger.error(
          { replayRequestId: item.replayRequestId, error: err },
          "Failed to process scheduled replay item"
        );
      }
    }
  } catch (error) {
    logger.error({ error }, "Error in scheduled replay polling loop");
  }
}

async function main() {
  logger.info("Scheduled Replay Worker started");
  
  while (true) {
    await processDueReplays();
    await sleep(POLLING_INTERVAL_MS);
  }
}

main().catch(err => {
  logger.error({ err }, "Scheduled Replay Worker crashed");
  process.exit(1);
});
