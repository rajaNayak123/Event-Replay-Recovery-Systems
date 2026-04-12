import { env } from "../config/env";

export const STREAMS = {
  ORDERS: env.STREAM_ORDERS,
  RETRY: env.STREAM_RETRY,
  REPLAY: env.STREAM_REPLAY,
  DLQ: env.STREAM_DLQ
};

export const GROUPS = {
  ORDERS: env.ORDER_CONSUMER_GROUP,
  REPLAY: env.REPLAY_CONSUMER_GROUP
};