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

  // If the event is already REPLAYED, skip silently — this can happen when
  // Kafka redelivers a message after a restart
  if (failed.status === FailedEventStatus.REPLAYED) {
    logger.warn(
      { failedEventId: failed.id },
      "Replay message received for already-replayed event, skipping"
    );
    return;
  }

  try {
    const replayEvent = {
      ...payload.event,
      payload: {
        ...payload.event.payload,
        // Override shouldFailInventory to false on replay so inventory
        // reservation does not intentionally fail again
        shouldFailInventory: false
      },
      meta: {
        ...(payload.event.meta || {}),
        isReplay: true,
        replayOfFailedEventId: payload.failedEventId,
        replayRequestedBy: payload.requestedBy,
        originalStream: failed.streamName
      }
    };

    const result = await processingService.processOrderCreated(
      {
        ...payload.event,
        payload: {
          ...payload.event.payload,
          shouldFailInventory: false   
        },
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

    // Whether processed fresh or skipped due to idempotency, mark as REPLAYED
    await failedEventRepository.updateStatus(failed.id, {
      status: FailedEventStatus.REPLAYED,
      replayedAt: new Date(),
      replayRequestedBy: payload.requestedBy,
      replayMetadata: {
        replayRequestId: payload.replayRequestId,
        skipped: result.skipped,
        reason: result.reason ?? null,
        replayed: true
      }
    });

    const logStatus = result.skipped
      ? ReplayLogStatus.SKIPPED_ALREADY_PROCESSED
      : ReplayLogStatus.SUCCESS;

    await safeUpdateReplayLog(payload.replayRequestId, {
      status: logStatus,
      resultPayload: {
        skipped: result.skipped,
        reason: result.reason ?? null,
        replayed: !result.skipped
      }
    });

    if (result.skipped) {
      logger.warn(
        { failedEventId: failed.id, reason: result.reason },
        "Replay event was already processed — marked as REPLAYED"
      );
    } else {
      logger.info({ failedEventId: failed.id }, "Replay succeeded");
    }
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

    await safeUpdateReplayLog(payload.replayRequestId, {
      status: ReplayLogStatus.FAILED,
      errorMessage: error.message
    });

    logger.error(
      { failedEventId: failed.id, error: error.message },
      "Replay failed"
    );
  }
}

// Wraps replayLog update so a missing/stale log ID never crashes the handler
async function safeUpdateReplayLog(
  id: string,
  data: {
    status: ReplayLogStatus;
    resultPayload?: Record<string, unknown>;
    errorMessage?: string;
  }
) {
  try {
    await replayLogRepository.update(id, data);
  } catch (err: any) {
    logger.warn(
      { replayRequestId: id, error: err.message },
      "Could not update replay log — log entry may not exist for this ID"
    );
  }
}