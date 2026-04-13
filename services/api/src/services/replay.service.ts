import { replayRequestService } from "shared";

export const replayService = {
  requestReplay(id: string, requestedBy: string) {
    return replayRequestService.requestReplay(id, requestedBy);
  }
};