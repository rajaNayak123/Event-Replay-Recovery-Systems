import { Router } from "express";
import { getMetrics } from "../controllers/metrics.controller";
import { asyncHandler } from "../lib/async-handler";
import { authMiddleware } from "../lib/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(getMetrics));

export default router;