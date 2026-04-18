import "dotenv/config";
import { logger, prisma } from "shared";
import { startWorker } from "./worker";

async function main() {
  await prisma.$connect();
  logger.info("Consumer worker dependencies connected");
  await startWorker();
}

main().catch((error) => {
  logger.error(error, "Consumer worker crashed");
  process.exit(1);
});