import { kafka } from "./client";
import { TOPICS } from "./topics";
import { logger } from "../logging/logger";

export async function ensureKafkaTopics() {
  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: TOPICS.ORDER_CREATED, numPartitions: 1, replicationFactor: 1 },
      { topic: TOPICS.ORDER_RETRY, numPartitions: 1, replicationFactor: 1 },
      { topic: TOPICS.ORDER_REPLAY, numPartitions: 1, replicationFactor: 1 },
      { topic: TOPICS.ORDER_DLQ, numPartitions: 1, replicationFactor: 1 }
    ]
  });

  logger.info("Kafka topics ensured");
  await admin.disconnect();
}