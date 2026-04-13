import { env } from "../config/env";
import { publishToStream } from "../redis/publisher";
import { STREAMS } from "../constants/streams";
import { sleep } from "../utils/sleep";
import { BaseEvent } from "../events/types";

export const retryService = {
  async scheduleRetry(event: BaseEvent, retryCount: number) {
    const delay = env.RETRY_BACKOFF_MS * retryCount;
    await sleep(delay);
    await publishToStream(STREAMS.RETRY, {
      ...event,
      meta: {
        ...event.meta,
        retryCount
      }
    });
  }
};