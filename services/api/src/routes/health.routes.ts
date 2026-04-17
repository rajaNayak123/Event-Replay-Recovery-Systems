import { Router } from "express";
import { healthCheck } from "../controllers/health.controller";
import { asyncHandler } from "../lib/async-handler";

const router = Router();

router.get("/", asyncHandler(healthCheck));

export default router;