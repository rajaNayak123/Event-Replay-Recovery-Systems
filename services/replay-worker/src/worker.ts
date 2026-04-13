import {
  ack,
  ensureConsumerGroup,
  GROUPS,
  logger,
  readGroup,
  safeJsonParse,
  STREAMS
} from "shared";
import { handleReplayRequest } from "./handlers/replay-request.handler";

export async function startReplayWorker() {
  await ensureConsumerGroup(STREAMS.REPLAY, GROUPS.REPLAY);

  logger.info({ stream: STREAMS.REPLAY }, "Replay worker started");

  while (true) {
    const messages = await readGroup(
      STREAMS.REPLAY,
      GROUPS.REPLAY,
      process.env.REPLAY_CONSUMER_NAME || "replay-1",
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

        const payload = safeJsonParse<any>(fieldMap.data);

        try {
          await handleReplayRequest(payload);
        } finally {
          await ack(STREAMS.REPLAY, GROUPS.REPLAY, messageId);
        }
      }
    }
  }
}