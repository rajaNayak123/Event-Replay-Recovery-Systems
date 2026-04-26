import { replayRequestService } from "shared";
import { ApiError } from "../lib/api-error";

export const replayService = {
  async requestReplay(id: string, userId: string, scheduledAt?: string) {
    try {
      return await replayRequestService.requestReplay(id, userId, scheduledAt);

    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new ApiError(404, error.message);
      }

      if (error instanceof Error && error.message.includes("only allowed")) {
        throw new ApiError(400, error.message);
      }

      throw error;
    }
  }
};