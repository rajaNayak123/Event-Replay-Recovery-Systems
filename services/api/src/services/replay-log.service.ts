import { replayLogRepository, ReplayLogStatus } from "shared";

export const replayLogService = {
  async list(filters?: { status?: ReplayLogStatus; search?: string }) {
    return replayLogRepository.list(filters);
  }

};
