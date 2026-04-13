import { prisma } from "../db/prisma";

export const processedEventRepository = {
  findByEventId(eventId: string) {
    return prisma.processedEvent.findUnique({ where: { eventId } });
  },

  create(data: {
    eventId: string;
    eventType: string;
    tenantId: string;
    orderId?: string;
    sourceStream: string;
    replayed: boolean;
    processor: string;
    checksum?: string;
    metadata?: Record<string, unknown>;
  }) {
    return prisma.processedEvent.create({ data });
  }
};