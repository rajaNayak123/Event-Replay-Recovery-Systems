import { Kafka, logLevel } from "kafkajs";
import { env } from "../config/env";

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(",").map((s) => s.trim()),
  logLevel: logLevel.NOTHING
});