import {
  ack,
  autoClaimPending,
  ensureConsumerGroup,
  GROUPS,
  logger,
  parseRedisFields,
  readGroup,
  safeJsonParse,
  STREAMS
} from "shared";
import { handleOrderCreated } from "./handlers/order-created.handler";

const streamsToConsume = [STREAMS.ORDERS, STREAMS.RETRY];
const MIN_IDLE_TIME_MS = 30000;

async function processEntries(stream: string, entries: any[], group: string) {
  for (const [messageId, fields] of entries) {
    const fieldMap = parseRedisFields(fields);
    const event = safeJsonParse<any>(fieldMap.data);

    try {
      await handleOrderCreated(event, stream);
    } finally {
      await ack(stream, group, messageId);
    }
  }
}

async function recoverPending(stream: string, group: string, consumer: string) {
  let cursor = "0-0";

  while (true) {
    const result = await autoClaimPending(
      stream,
      group,
      consumer,
      MIN_IDLE_TIME_MS,
      cursor,
      10
    );

    const [nextCursor, claimedEntries] = result as any;
    cursor = nextCursor;

    if (claimedEntries?.length) {
      logger.warn(
        { stream, count: claimedEntries.length },
        "Recovered stale pending messages"
      );

      await processEntries(stream, claimedEntries, group);
    }

    if (cursor === "0-0") {
      break;
    }
  }
}

export async function startWorker() {
  const consumerName = process.env.ORDER_CONSUMER_NAME || "consumer-1";

  for (const stream of streamsToConsume) {
    await ensureConsumerGroup(stream, GROUPS.ORDERS);
  }

  logger.info({ streams: streamsToConsume }, "Consumer worker started");

  while (true) {
    for (const stream of streamsToConsume) {
      await recoverPending(stream, GROUPS.ORDERS, consumerName);

      const messages = await readGroup(
        stream,
        GROUPS.ORDERS,
        consumerName,
        10,
        1000
      );

      if (!messages) continue;

      for (const [, entries] of messages as any) {
        await processEntries(stream, entries, GROUPS.ORDERS);
      }
    }
  }
}