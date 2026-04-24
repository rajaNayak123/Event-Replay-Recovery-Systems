import { Request, Response } from "express";
import { failedEventService } from "../services/failed-event.service";
import { replayService } from "../services/replay.service";
import { ApiError } from "../lib/api-error";

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
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  const result = await replayService.requestReplay(
    req.params.id as string,
    user.id,
    user.name || "Unknown User"
  );
  return res.status(202).json(result);
}