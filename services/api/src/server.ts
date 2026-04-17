import "dotenv/config";
import { env, logger } from "shared";
import { createApp } from "./app";
import { bootstrapApi } from "./lib/bootstrap";

async function main() {
  await bootstrapApi();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API server listening");
  });
}

main().catch((error) => {
  logger.error(error, "API failed to start");
  process.exit(1);
});