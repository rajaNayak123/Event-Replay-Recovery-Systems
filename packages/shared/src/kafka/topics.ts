import { env } from "../config/env";

export const TOPICS = {
  ORDER_CREATED: env.TOPIC_ORDER_CREATED,
  ORDER_RETRY: env.TOPIC_ORDER_RETRY,
  ORDER_REPLAY: env.TOPIC_ORDER_REPLAY,
  ORDER_DLQ: env.TOPIC_ORDER_DLQ
};