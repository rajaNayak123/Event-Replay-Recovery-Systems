import { redis } from "./client";

export async function readGroup(
  stream: string,
  group: string,
  consumer: string,
  count = 10,
  blockMs = 5000
) {
  return redis.xreadgroup(
    "GROUP",
    group,
    consumer,
    "COUNT",
    count,
    "BLOCK",
    blockMs,
    "STREAMS",
    stream,
    ">"
  );
}

export async function ack(stream: string, group: string, messageId: string) {
  return redis.xack(stream, group, messageId);
}

// Add XAUTOCLAIM support for stale pending messages
export async function autoClaimPending(
  stream: string,
  group: string,
  consumer: string,
  minIdleTimeMs: number,
  startId = "0-0",
  count = 10
) {
  return redis.xautoclaim(
    stream,
    group,
    consumer,
    minIdleTimeMs,
    startId,
    "COUNT",
    count
  );
}