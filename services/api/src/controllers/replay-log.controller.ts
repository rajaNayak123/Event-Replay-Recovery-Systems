import { Request, Response } from "express";
import { replayLogService } from "../services/replay-log.service";
import { ReplayLogStatus } from "shared";
import { verifyToken } from "../lib/auth";

export async function listReplayLogs(req: Request, res: Response) {
  await verifyToken(req);
  const { status } = req.query;
  const data = await replayLogService.list({
    status: status as ReplayLogStatus | undefined
  });
  return res.json(data);
}
