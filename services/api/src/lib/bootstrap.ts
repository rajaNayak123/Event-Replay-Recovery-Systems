import { logger, prisma, redis } from "shared";

export async function bootstrapApi() {
  await prisma.$connect();
  await redis.ping();
  logger.info("API dependencies connected");
}