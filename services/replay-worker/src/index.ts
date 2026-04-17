import "dotenv/config";
import { logger, prisma, redis } from "shared";
import { startReplayWorker } from "./worker";

async function main() {
  await prisma.$connect();
  await redis.ping();
  logger.info("Replay worker dependencies connected");

  await startReplayWorker();
}

main().catch((error) => {
  logger.error(error, "Replay worker crashed");
  process.exit(1);
});