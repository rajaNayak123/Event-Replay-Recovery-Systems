import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  KAFKA_BROKERS: z.string().default("kafka:9092"),
  KAFKA_CLIENT_ID: z.string().default("event-replay-platform"),

  TOPIC_ORDER_CREATED: z.string().default("order.created"),
  TOPIC_ORDER_RETRY: z.string().default("order.created.retry"),
  TOPIC_ORDER_REPLAY: z.string().default("order.replay"),
  TOPIC_ORDER_DLQ: z.string().default("order.created.dlq"),

  ORDER_CONSUMER_GROUP: z.string().default("order-processors"),
  REPLAY_CONSUMER_GROUP: z.string().default("replay-processors"),

  MAX_RETRIES: z.coerce.number().default(3),
  RETRY_BACKOFF_MS: z.coerce.number().default(2000),

  INVENTORY_FAILURE_MODE: z.enum(["always", "random", "off"]).default("always"),
  INVENTORY_FAILURE_PERCENT: z.coerce.number().default(100),

  REPLAY_REQUESTED_BY_DEFAULT: z.string().default("demo-user"),
  LOG_LEVEL: z.string().default("info")
});

export const env = envSchema.parse(process.env);