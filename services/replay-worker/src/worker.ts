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
import { handleReplayRequest } from "./handlers/replay-request.handler";

const MIN_IDLE_TIME_MS = 30000;

async function processEntries(entries: any[]) {
  for (const [messageId, fields] of entries) {
    const fieldMap = parseRedisFields(fields);
    const payload = safeJsonParse<any>(fieldMap.data);

    try {
      await handleReplayRequest(payload);
    } finally {
      await ack(STREAMS.REPLAY, GROUPS.REPLAY, messageId);
    }
  }
}

async function recoverPending(group: string, consumer: string) {
  let cursor = "0-0";

  while (true) {
    const result = await autoClaimPending(
      STREAMS.REPLAY,
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
        { stream: STREAMS.REPLAY, count: claimedEntries.length },
        "Recovered stale replay messages"
      );
      await processEntries(claimedEntries);
    }

    if (cursor === "0-0") {
      break;
    }
  }
}

export async function startReplayWorker() {
  const consumerName = process.env.REPLAY_CONSUMER_NAME || "replay-1";

  await ensureConsumerGroup(STREAMS.REPLAY, GROUPS.REPLAY);

  logger.info({ stream: STREAMS.REPLAY }, "Replay worker started");

  while (true) {
    await recoverPending(GROUPS.REPLAY, consumerName);

    const messages = await readGroup(
      STREAMS.REPLAY,
      GROUPS.REPLAY,
      consumerName,
      10,
      1000
    );

    if (!messages) continue;

    for (const [, entries] of messages as any) {
      await processEntries(entries);
    }
  }
}