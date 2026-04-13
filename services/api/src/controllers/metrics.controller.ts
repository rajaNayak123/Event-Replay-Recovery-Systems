import { Request, Response } from "express";
import { failedEventService } from "../services/failed-event.service";

export async function getMetrics(_req: Request, res: Response) {
  const counts = await failedEventService.counts();
  return res.json({
    failedEventsByStatus: counts
  });
}