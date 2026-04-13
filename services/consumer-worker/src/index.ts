import "dotenv/config";
import { logger } from "shared";
import { startWorker } from "./worker";

startWorker().catch((error) => {
  logger.error(error, "Consumer worker crashed");
  process.exit(1);
});