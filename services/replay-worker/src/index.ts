import "dotenv/config";
import { logger, prisma } from "shared";
import { startReplayWorker } from "./worker";

async function main() {
  await prisma.$connect();
  logger.info("Replay worker dependencies connected");

  await startReplayWorker();
}

main().catch((error) => {
  logger.error(error, "Replay worker crashed");
  process.exit(1);
});