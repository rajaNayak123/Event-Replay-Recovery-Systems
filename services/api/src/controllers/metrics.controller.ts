import { Request, Response } from "express";
import { failedEventService } from "../services/failed-event.service";
import { verifyToken } from "../lib/auth";

export async function getMetrics(req: Request, res: Response) {
  await verifyToken(req);
  const counts = await failedEventService.counts();
  return res.json({
    failedEventsByStatus: counts
  });
}