import { ReplayLogStatus } from "../../../../generated/prisma";
import { prisma } from "../db/prisma";

export const replayLogRepository = {
  create(data: {
    failedEventId: string;
    eventId: string;
    requestedBy: string;
    status?: ReplayLogStatus;
    requestPayload?: unknown;
  }) {
    return prisma.replayLog.create({
      data: {
        failedEventId: data.failedEventId,
        eventId: data.eventId,
        requestedBy: data.requestedBy,
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
  }
};