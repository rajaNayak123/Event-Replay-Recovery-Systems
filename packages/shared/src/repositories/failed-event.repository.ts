import { FailedEventStatus } from "../../../../generated/prisma";
import { prisma } from "../db/prisma";

export const failedEventRepository = {
  create(data: {
    eventId: string;
    eventType: string;
    tenantId: string;
    streamName: string;
    orderId?: string;
    originalPayload: unknown;
    errorMessage: string;
    retryCount: number;
  }) {
    const now = new Date();
    return prisma.failedEvent.create({
      data: {
        eventId: data.eventId,
        eventType: data.eventType,
        tenantId: data.tenantId,
        streamName: data.streamName,
        orderId: data.orderId,
        originalPayload: data.originalPayload as any,
        errorMessage: data.errorMessage,
        retryCount: data.retryCount,
        firstFailedAt: now,
        lastFailedAt: now
      }
    });
  },

  updateStatus(
    id: string,
    data: {
      status: FailedEventStatus;
      errorMessage?: string;
      replayedAt?: Date | null;
      replayRequestedBy?: string | null;
      replayMetadata?: unknown;
      retryCount?: number;
      lastFailedAt?: Date;
    }
  ) {
    return prisma.failedEvent.update({
      where: { id },
      data: {
        ...data,
        replayMetadata: data.replayMetadata as any
      }
    });
  },

  findById(id: string) {
    return prisma.failedEvent.findUnique({
      where: { id },
      include: { replayLogs: { orderBy: { createdAt: "desc" } } }
    });
  },

  findByEventId(eventId: string) {
    return prisma.failedEvent.findUnique({ where: { eventId } });
  },

  list(filters: { status?: string; search?: string }) {
    return prisma.failedEvent.findMany({
      where: {
        ...(filters.status ? { status: filters.status as any } : {}),
        ...(filters.search
          ? {
              OR: [
                { eventId: { contains: filters.search, mode: "insensitive" } },
                { orderId: { contains: filters.search, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: "desc" }
    });
  },

  counts() {
    return prisma.failedEvent.groupBy({
      by: ["status"],
      _count: true
    });
  }
};