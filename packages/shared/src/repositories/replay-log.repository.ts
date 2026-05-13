import { ReplayLogStatus } from "../../../../generated/prisma";
import { prisma } from "../db/prisma";

export const replayLogRepository = {
  create(data: {
    failedEventId: string;
    eventId: string;
    userId: string;
    status?: ReplayLogStatus;
    requestPayload?: unknown;
  }) {
    return prisma.replayLog.create({
      data: {
        failedEventId: data.failedEventId,
        eventId: data.eventId,
        userId: data.userId,
        status: data.status,
        requestPayload: data.requestPayload as any
      }
    });
  },

  update(
    id: string,
    data: {
      status?: ReplayLogStatus;
      resultPayload?: unknown;
      errorMessage?: string | null;
    }
  ) {
    return prisma.replayLog.update({
      where: { id },
      data: {
        ...data,
        resultPayload: data.resultPayload as any
      }
    });
  },

  list(filters?: { status?: ReplayLogStatus; search?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { eventId: { contains: filters.search, mode: "insensitive" } },
        { errorMessage: { contains: filters.search, mode: "insensitive" } },
        { failedEventId: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    return prisma.replayLog.findMany({
      where,
      include: {
        failedEvent: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

};