import { publishToStream } from "../redis/publisher";

export class RedisEventBus {
  async publish(stream: string, event: unknown) {
    return publishToStream(stream, event);
  }
}