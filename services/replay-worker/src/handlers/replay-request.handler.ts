import { FailedEventStatus, ReplayLogStatus } from "../../../../generated/prisma";
import {
  failedEventRepository,
  processingService,
  replayLogRepository,
  logger
} from "shared";

export async function handleReplayRequest(payload: {
  replayRequestId: string;
  failedEventId: string;
  requestedBy: string;
  requestedAt: string;
  event: any;
}) {
  const failed = await failedEventRepository.findById(payload.failedEventId);

  if (!failed) {
    throw new Error("Failed event not found for replay");
  }

  try {
    const result = await processingService.processOrderCreated(
      {
        ...payload.event,
        meta: {
          ...(payload.event.meta || {}),
          isReplay: true,
          replayOfFailedEventId: payload.failedEventId,
          replayRequestedBy: payload.requestedBy,
          originalStream: failed.streamName
        }
      },
      "events:replay",
      "replay-worker"
    );

    if (result.skipped) {
      await failedEventRepository.updateStatus(failed.id, {
        status: FailedEventStatus.REPLAYED,
        replayedAt: new Date(),
        replayRequestedBy: payload.requestedBy,
        replayMetadata: {
          replayRequestId: payload.replayRequestId,
          skipped: true,
          reason: result.reason
        }
      });

      await replayLogRepository.update(payload.replayRequestId, {
        status: ReplayLogStatus.SKIPPED_ALREADY_PROCESSED,
        resultPayload: { skipped: true, reason: result.reason }
      });

      logger.warn({ failedEventId: failed.id }, "Replay skipped because event already processed");
      return;
    }

    await failedEventRepository.updateStatus(failed.id, {
      status: FailedEventStatus.REPLAYED,
      replayedAt: new Date(),
      replayRequestedBy: payload.requestedBy,
      replayMetadata: {
        replayRequestId: payload.replayRequestId,
        replayed: true
      }
    });

    await replayLogRepository.update(payload.replayRequestId, {
      status: ReplayLogStatus.SUCCESS,
      resultPayload: { replayed: true }
    });

    logger.info({ failedEventId: failed.id }, "Replay succeeded");
  } catch (error: any) {
    await failedEventRepository.updateStatus(failed.id, {
      status: FailedEventStatus.REPLAY_FAILED,
      errorMessage: error.message,
      replayRequestedBy: payload.requestedBy,
      lastFailedAt: new Date(),
      replayMetadata: {
        replayRequestId: payload.replayRequestId,
        replayed: false
      }
    });

    await replayLogRepository.update(payload.replayRequestId, {
      status: ReplayLogStatus.FAILED,
      errorMessage: error.message
    });

    logger.error(
      { failedEventId: failed.id, error: error.message },
      "Replay failed"
    );
  }
}