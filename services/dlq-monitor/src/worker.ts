import { env, kafka, logger, TOPICS } from "shared";
import { handleDLQMessage } from "./handlers/dlq.handler";

export async function startWorker() {
  const consumer = kafka.consumer({
    groupId: "dlq-monitor-group"
  });

  await consumer.connect();
  await consumer.subscribe({
    topics: [TOPICS.ORDER_DLQ]
  });

  logger.info(
    { topics: [TOPICS.ORDER_DLQ] },
    "DLQ Monitor Service started"
  );

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawValue = message.value?.toString();
      if (!rawValue) return;

      try {
        const payload = JSON.parse(rawValue);
        await handleDLQMessage(payload, topic);
      } catch (error) {
        logger.error(
          {
            topic,
            partition,
            offset: message.offset,
            error: error instanceof Error ? error.message : String(error)
          },
          "DLQ Monitor failed to handle message"
        );
      }
    }
  });

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("Disconnecting DLQ monitor worker...");
    await consumer.disconnect();
    logger.info("DLQ monitor worker disconnected");
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

