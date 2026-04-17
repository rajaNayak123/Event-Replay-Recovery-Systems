import "dotenv/config";
import { logger, prisma, redis } from "shared";
import { startWorker } from "./worker";

async function main() {
  await prisma.$connect();
  await redis.ping();
  logger.info("Consumer worker dependencies connected");

  await startWorker();
}

main().catch((error) => {
  logger.error(error, "Consumer worker crashed");
  process.exit(1);
});