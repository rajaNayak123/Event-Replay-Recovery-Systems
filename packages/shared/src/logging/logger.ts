import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "amount",
      "currency",
      "tenantId",
      "payload.amount",
      "payload.currency",
      "payload.tenantId",
      "event.payload.amount",
      "event.payload.currency",
      "event.tenantId",
      "email",
      "password",
      "token",
      "authorization"
    ],
    remove: true
  },
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" }
        }
      : undefined
});