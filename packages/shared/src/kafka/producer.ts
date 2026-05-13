import { kafka } from "./client";
import { logger } from "../logging/logger";

const producer = kafka.producer();

let connected = false;

// Register event listeners to manage state correctly
producer.on(producer.events.CONNECT, () => {
  connected = true;
  logger.info("Kafka producer connected");
});

producer.on(producer.events.DISCONNECT, () => {
  connected = false;
  logger.warn("Kafka producer disconnected");
});

export async function connectProducer() {
  if (!connected) {
    try {
      await producer.connect();
    } catch (error) {
      logger.error({ error }, "Failed to connect Kafka producer");
      connected = false;
      throw error;
    }
  }
}

export async function publishKafkaMessage(topic: string, key: string, value: unknown, headers?: Record<string, string>) {
  try {
    await connectProducer();

    await producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          headers
        }
      ]
    });
  } catch (error) {
    logger.error({ error, topic, key }, "Failed to publish Kafka message");
    // If it's a connection error, reset state to force reconnect next time
    if (error instanceof Error && error.message.includes("not connected")) {
      connected = false;
    }
    throw error;
  }
}

// Graceful shutdown
const shutdown = async () => {
  logger.info("Disconnecting Kafka producer...");
  await producer.disconnect();
  logger.info("Kafka producer disconnected");
};

process.on("SIGTERM", async () => {
  await shutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await shutdown();
  process.exit(0);
});