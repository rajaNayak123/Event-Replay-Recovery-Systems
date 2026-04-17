import { Router } from "express";
import { getMetrics } from "../controllers/metrics.controller";
import { asyncHandler } from "../lib/async-handler";

const router = Router();

router.get("/", asyncHandler(getMetrics));

export default router;