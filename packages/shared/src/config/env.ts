import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  STREAM_ORDERS: z.string().default("events:orders"),
  STREAM_RETRY: z.string().default("events:orders:retry"),
  STREAM_REPLAY: z.string().default("events:replay"),
  STREAM_DLQ: z.string().default("events:orders:dlq"),

  ORDER_CONSUMER_GROUP: z.string().default("order-processors"),
  ORDER_CONSUMER_NAME: z.string().default("consumer-1"),
  REPLAY_CONSUMER_GROUP: z.string().default("replay-processors"),
  REPLAY_CONSUMER_NAME: z.string().default("replay-1"),

  MAX_RETRIES: z.coerce.number().default(3),
  RETRY_BACKOFF_MS: z.coerce.number().default(2000),

  INVENTORY_FAILURE_MODE: z.enum(["always", "random", "off"]).default("always"),
  INVENTORY_FAILURE_PERCENT: z.coerce.number().default(100),

  REPLAY_REQUESTED_BY_DEFAULT: z.string().default("demo-user"),
  LOG_LEVEL: z.string().default("info")
});

export const env = envSchema.parse(process.env);