import { ensureKafkaTopics, logger, prisma, redis } from "shared";

export async function bootstrapApi() {
  await prisma.$connect();
  await redis.ping();
  await ensureKafkaTopics();
  logger.info("API dependencies connected");
}