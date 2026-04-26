import { Router } from "express";
import { listReplayLogs } from "../controllers/replay-log.controller";
import { asyncHandler } from "../lib/async-handler";

const router = Router();

router.get("/", asyncHandler(listReplayLogs));

export default router;
