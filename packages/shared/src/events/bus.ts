import { publishKafkaMessage } from "../kafka/producer";

export class KafkaEventBus {
  async publish(
    topic: string,
    key: string,
    event: unknown,
    headers?: Record<string, string>
  ) {
    return publishKafkaMessage(topic, key, event, headers);
  }
}