import { failedEventRepository } from "shared";

export const failedEventService = {
  list(filters: { status?: string; search?: string }) {
    return failedEventRepository.list(filters);
  },
  getById(id: string) {
    return failedEventRepository.findById(id);
  },
  counts() {
    return failedEventRepository.counts();
  }
};