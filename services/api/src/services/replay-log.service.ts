import { replayLogRepository, ReplayLogStatus } from "shared";

export const replayLogService = {
  async list(filters?: { status?: ReplayLogStatus }) {
    return replayLogRepository.list(filters);
  }
};
