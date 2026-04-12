import { redis } from "./client";
import { logger } from "../logging/logger";

export async function ensureConsumerGroup(stream: string, group: string) {
  try {
    await redis.xgroup("CREATE", stream, group, "0", "MKSTREAM");
    logger.info({ stream, group }, "Consumer group created");
  } catch (error: any) {
    if (!String(error?.message || "").includes("BUSYGROUP")) {
      throw error;
    }
  }
}