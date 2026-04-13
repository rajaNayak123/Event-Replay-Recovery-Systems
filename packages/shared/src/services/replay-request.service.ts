import { FailedEventStatus } from "../../../../generated/prisma";
import { failedEventRepository } from "../repositories/failed-event.repository";
import { replayLogRepository } from "../repositories/replay-log.repository";
import { publishToStream } from "../redis/publisher";
import { STREAMS } from "../constants/streams";
import { safeJsonParse } from "../utils/json";

export const replayRequestService = {
  async requestReplay(failedEventId: string, requestedBy: string) {
    const failedEvent = await failedEventRepository.findById(failedEventId);

    if (!failedEvent) {
      throw new Error("Failed event not found");
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

    await publishToStream(STREAMS.REPLAY, {
      replayRequestId: replayLog.id,
      failedEventId: failedEvent.id,
      requestedBy,
      requestedAt: new Date().toISOString(),
      event: failedEvent.originalPayload
    });

    return { failedEvent, replayLog };
  }
};