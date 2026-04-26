import { Request, Response } from "express";
import { failedEventService } from "../services/failed-event.service";
import { replayService } from "../services/replay.service";
import { ApiError } from "../lib/api-error";

import { verifyToken } from "../lib/auth";

export async function listFailedEvents(req: Request, res: Response) {
  const { status, search } = req.query;
  const data = await failedEventService.list({
    status: status as string | undefined,
    search: search as string | undefined
  });
  return res.json(data);
}

export async function getFailedEventById(req: Request, res: Response) {
  const item = await failedEventService.getById(req.params.id as string);
  if (!item) {
    throw new ApiError(404, "Failed event not found");
  }
  return res.json(item);
}

export async function replayFailedEvent(req: Request, res: Response) {
  const user = await verifyToken(req);
  const userName = user?.email || "System";
  
  const result = await replayService.requestReplay(
    req.params.id as string,
    userName
  );
  return res.status(202).json(result);
}