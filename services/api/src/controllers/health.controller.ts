import { Request, Response } from "express";
import { prisma, redis } from "shared";

export async function healthCheck(_req: Request, res: Response) {
  await prisma.$queryRaw`SELECT 1`;
  await redis.ping();

  return res.json({
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString()
  });
}