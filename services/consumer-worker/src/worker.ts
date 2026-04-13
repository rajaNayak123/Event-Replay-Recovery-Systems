import {
  ack,
  ensureConsumerGroup,
  GROUPS,
  logger,
  readGroup,
  safeJsonParse,
  STREAMS
} from "shared";
import { handleOrderCreated } from "./handlers/order-created.handler";

const streamsToConsume = [STREAMS.ORDERS, STREAMS.RETRY];

export async function startWorker() {
  for (const stream of streamsToConsume) {
    await ensureConsumerGroup(stream, GROUPS.ORDERS);
  }

  logger.info({ streams: streamsToConsume }, "Consumer worker started");

  while (true) {
    for (const stream of streamsToConsume) {
      const messages = await readGroup(
        stream,
        GROUPS.ORDERS,
        process.env.ORDER_CONSUMER_NAME || "consumer-1",
        10,
        1000
      );

      if (!messages) continue;

      for (const [, entries] of messages as any) {
        for (const [messageId, fields] of entries) {
          const fieldMap = Object.fromEntries(
            fields.reduce((acc: string[][], value: string, index: number, array: string[]) => {
              if (index % 2 === 0) acc.push([value, array[index + 1]]);
              return acc;
            }, [])
          );

          const event = safeJsonParse<any>(fieldMap.data);

          try {
            await handleOrderCreated(event, stream);
          } finally {
            await ack(stream, GROUPS.ORDERS, messageId);
          }
        }
      }
    }
  }
}