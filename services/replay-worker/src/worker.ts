import { env, kafka, logger, TOPICS } from "shared";
import { handleReplayRequest } from "./handlers/replay-request.handler";

export async function startReplayWorker() {
  const consumer = kafka.consumer({
    groupId: env.REPLAY_CONSUMER_GROUP
  });

  await consumer.connect();
  await consumer.subscribe({ topic: TOPICS.ORDER_REPLAY });

  logger.info({ topic: TOPICS.ORDER_REPLAY }, "Kafka replay worker started");

  await consumer.run({
    autoCommit: false,
    eachBatchAutoResolve: false,
    eachBatch: async ({
      batch,
      resolveOffset,
      commitOffsetsIfNecessary,
      heartbeat,
      isRunning,
      isStale
    }) => {
      for (const message of batch.messages) {
        if (!isRunning() || isStale()) break;

        const rawValue = message.value?.toString();
        if (!rawValue) {
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          continue;
        }

        const payload = JSON.parse(rawValue);
        const traceId = message.headers?.["x-trace-id"]?.toString();

        try {
          await handleReplayRequest(payload, traceId);
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          await heartbeat();
        } catch (error) {
          logger.error(
            {
              topic: batch.topic,
              partition: batch.partition,
              offset: message.offset,
              traceId,
              error: error instanceof Error ? error.message : String(error)
            },
            "Replay worker failed to process replay message"
          );

          throw error;
        }
      }
    }
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("Disconnecting replay worker...");
    await consumer.disconnect();
    logger.info("Replay worker disconnected");
  };

  process.on("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });
}