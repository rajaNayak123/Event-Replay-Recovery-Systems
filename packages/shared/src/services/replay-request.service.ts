import { FailedEventStatus } from "../../../../generated/prisma/client";
import { failedEventsCacheService } from "../cache/failed-events-cache.service";
import { publishKafkaMessage } from "../kafka/producer";
import { TOPICS } from "../kafka/topics";
import { failedEventRepository } from "../repositories/failed-event.repository";
import { replayLogRepository } from "../repositories/replay-log.repository";
import { scheduledReplayService } from "./scheduled-replay.service";
import { prisma } from "../db/prisma";

export const replayRequestService = {
  async requestReplay(failedEventId: string, userId: string, scheduledAt?: string) {
    const failedEvent = await failedEventRepository.findById(failedEventId);

    if (!failedEvent) {
      throw new Error("Failed event not found");
    }

    if (
      failedEvent.status !== "FAILED" &&
      failedEvent.status !== "REPLAY_FAILED"
    ) {
      throw new Error(
        `Replay is only allowed for FAILED or REPLAY_FAILED events. Current status: ${failedEvent.status}`
      );
    }

    // Resolve user from ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userName = user.email || user.name || "Unknown User";

    const replayLog = await replayLogRepository.create({
      failedEventId,
      eventId: failedEvent.eventId,
      userId: user.id,
      requestPayload: {
        failedEventId,
        requestedBy: userName,
        scheduledAt
      }
    });

    try {
      await failedEventRepository.updateStatus(failedEventId, {
        status: FailedEventStatus.REPLAY_PENDING,
        replayRequestedBy: userName,
        replayMetadata: {
          replayLogId: replayLog.id,
          requestedAt: new Date().toISOString(),
          scheduledAt: scheduledAt || null
        }
      });

      if (scheduledAt) {
        // Schedule in Redis sorted set instead of immediate Kafka publication
        await scheduledReplayService.schedule({
          replayRequestId: replayLog.id,
          failedEventId: failedEvent.id,
          requestedBy: userName,
          event: failedEvent.originalPayload,
          scheduledAt: new Date(scheduledAt).getTime()
        });
      } else {
        // Immediate publication to Kafka
        await publishKafkaMessage(
          TOPICS.ORDER_REPLAY,
          failedEvent.eventId,
          {
            replayRequestId: replayLog.id,  
            failedEventId: failedEvent.id,
            requestedBy: userName,
            requestedAt: new Date().toISOString(),
            event: failedEvent.originalPayload
          },
          {
            replayRequestId: replayLog.id,
            eventId: failedEvent.eventId,
            replay: "true"
          }
        );
      }
    } catch (error: any) {
      // Revert status if anything fails
      await failedEventRepository.updateStatus(failedEventId, {
        status: failedEvent.status,
      });

      await replayLogRepository.update(replayLog.id, {
        status: "FAILED",
        errorMessage: `Failed to ${scheduledAt ? 'schedule' : 'initiate'} replay: ${error.message}`
      });

      throw error;
    }

    await failedEventsCacheService.invalidateForFailedEvent(failedEventId);

    return {
      replayAccepted: true,
      replayLogId: replayLog.id,
      failedEventId: failedEvent.id,
      scheduled: !!scheduledAt
    };
  }
};