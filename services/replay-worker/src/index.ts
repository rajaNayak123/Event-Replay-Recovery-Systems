import "dotenv/config";
import { logger } from "shared";
import { startReplayWorker } from "./worker";

startReplayWorker().catch((error) => {
  logger.error(error, "Replay worker crashed");
  process.exit(1);
});