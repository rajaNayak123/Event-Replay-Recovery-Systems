import crypto from "crypto";
import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../db/prisma";
import { BaseEvent } from "../events/types";
import { paymentService } from "./payment.service";
import { inventoryService } from "./inventory.service";
import { processedEventRepository } from "../repositories/processed-event.repository";

export const processingService = {
  async processOrderCreated(
    event: BaseEvent<{ amount: number; currency: string; shouldFailInventory?: boolean }>,
    sourceStream: string,
    processor: string
  ) {
    const existing = await processedEventRepository.findByEventId(event.eventId);

    if (existing) {
      return {
        skipped: true,
        reason: "already_processed"
      };
    }

    await paymentService.process(event.orderId);
    await inventoryService.reserve(event.orderId, event.payload.shouldFailInventory);

    const checksum = crypto
      .createHash("sha256")
      .update(JSON.stringify(event))
      .digest("hex");

    try {
      await prisma.processedEvent.create({
        data: {
          eventId: event.eventId,
          eventType: event.eventType,
          tenantId: event.tenantId,
          orderId: event.orderId,
          sourceStream,
          replayed: !!event.meta?.isReplay,
          processor,
          checksum,
          metadata: {
            originalStream: event.meta?.originalStream ?? sourceStream,
            replayOfFailedEventId: event.meta?.replayOfFailedEventId ?? null
          }
        }
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          skipped: true,
          reason: "already_processed_race"
        };
      }
      throw error;
    }

    return {
      skipped: false,
      reason: null
    };
  }
};