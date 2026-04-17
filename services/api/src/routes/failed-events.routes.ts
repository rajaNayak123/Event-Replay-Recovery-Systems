import { Router } from "express";
import {
  getFailedEventById,
  listFailedEvents,
  replayFailedEvent
} from "../controllers/failed-events.controller";
import { asyncHandler } from "../lib/async-handler";

const router = Router();

router.get("/", asyncHandler(listFailedEvents));
router.get("/:id", asyncHandler(getFailedEventById));
router.post("/:id/replay", asyncHandler(replayFailedEvent));

export default router;