import { Router } from "express";
import {
  getFailedEventById,
  listFailedEvents,
  replayFailedEvent
} from "../controllers/failed-events.controller";

const router = Router();

router.get("/", listFailedEvents);
router.get("/:id", getFailedEventById);
router.post("/:id/replay", replayFailedEvent);

export default router;