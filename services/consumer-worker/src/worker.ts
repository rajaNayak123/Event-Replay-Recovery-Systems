import { env, kafka, logger, TOPICS } from "shared";
import { handleOrderCreated } from "./handlers/order-created.handler";

export async function startWorker() {
  const consumer = kafka.consumer({
    groupId: env.ORDER_CONSUMER_GROUP
  });

  await consumer.connect();
  await consumer.subscribe({
    topics: [TOPICS.ORDER_CREATED, TOPICS.ORDER_RETRY]
  });

  logger.info(
    { topics: [TOPICS.ORDER_CREATED, TOPICS.ORDER_RETRY] },
    "Kafka consumer worker started"
  );

  await consumer.run({
    autoCommit: false,
    eachBatchAutoResolve: false,
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
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

        const event = JSON.parse(rawValue);

        try {
          await handleOrderCreated(event, batch.topic);
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          await heartbeat();
        } catch (error) {
          logger.error(
            {
              topic: batch.topic,
              partition: batch.partition,
              offset: message.offset,
              error: error instanceof Error ? error.message : String(error)
            },
            "Kafka consumer failed to process message"
          );

          throw error;
        }
      }
    }
  });
}