import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";
import ordersRoutes from "./routes/orders.routes";
import failedEventsRoutes from "./routes/failed-events.routes";
import metricsRoutes from "./routes/metrics.routes";
import { errorHandler } from "./lib/error-handler";
import { notFoundHandler } from "./lib/not-found";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({
      service: "event-replay-api",
      status: "running"
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/failed-events", failedEventsRoutes);
  app.use("/api/metrics", metricsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}