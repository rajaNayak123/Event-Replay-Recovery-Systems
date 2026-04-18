import { FailedEventStatus } from "@prisma/client";
import { failedEventsCacheService } from "../cache/failed-events-cache.service";
import { publishKafkaMessage } from "../kafka/producer";
import { TOPICS } from "../kafka/topics";
import { failedEventRepository } from "../repositories/failed-event.repository";
import { replayLogRepository } from "../repositories/replay-log.repository";

export const replayRequestService = {
  async requestReplay(failedEventId: string, requestedBy: string) {
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

    const replayLog = await replayLogRepository.create({
      failedEventId,
      eventId: failedEvent.eventId,
      requestedBy,
      requestPayload: {
        failedEventId,
        requestedBy
      }
    });

    await failedEventRepository.updateStatus(failedEventId, {
      status: FailedEventStatus.REPLAY_PENDING,
      replayRequestedBy: requestedBy,
      replayMetadata: {
        replayLogId: replayLog.id,
        requestedAt: new Date().toISOString()
      }
    });

    await publishKafkaMessage(
      TOPICS.ORDER_REPLAY,
      failedEvent.eventId,
      {
        replayRequestId: replayLog.id,
        failedEventId: failedEvent.id,
        requestedBy,
        requestedAt: new Date().toISOString(),
        event: failedEvent.originalPayload
      },
      {
        replayRequestId: replayLog.id,
        eventId: failedEvent.eventId,
        replay: "true"
      }
    );

    await failedEventsCacheService.invalidateForFailedEvent(failedEventId);

    return {
      replayAccepted: true,
      replayLogId: replayLog.id,
      failedEventId: failedEvent.id
    };
  }
};