import { redis } from "./client";
import { safeJsonStringify } from "../utils/json";

export async function publishToStream(stream: string, payload: unknown) {
  return redis.xadd(stream, "*", "data", safeJsonStringify(payload));
}