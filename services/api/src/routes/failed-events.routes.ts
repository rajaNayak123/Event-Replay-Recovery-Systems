import { Router } from "express";
import {
  getFailedEventById,
  listFailedEvents,
  replayFailedEvent
} from "../controllers/failed-events.controller";
import { asyncHandler } from "../lib/async-handler";
import { authMiddleware } from "../lib/auth.middleware";

const router = Router();

// Protect all failed-events routes
router.use(authMiddleware);

router.get("/", asyncHandler(listFailedEvents));
router.get("/:id", asyncHandler(getFailedEventById));
router.post("/:id/replay", asyncHandler(replayFailedEvent));

export default router;