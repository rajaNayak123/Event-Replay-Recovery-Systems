import { kafka } from "./client";
import { logger } from "../logging/logger";

const producer = kafka.producer();

let connected = false;

export async function connectProducer() {
  if (!connected) {
    await producer.connect();
    connected = true;
    logger.info("Kafka producer connected");
  }
}

export async function publishKafkaMessage(topic: string, key: string, value: unknown, headers?: Record<string, string>) {
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
}