import { logger } from "shared";
import { startWorker } from "./worker";

async function main() {
  try {
    await startWorker();
  } catch (error) {
    logger.error({ error }, "DLQ Monitor Service crashed");
    process.exit(1);
  }
}

main();
