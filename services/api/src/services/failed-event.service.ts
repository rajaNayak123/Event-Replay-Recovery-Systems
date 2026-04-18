import { failedEventsCacheService, failedEventRepository } from "shared";

export const failedEventService = {
  async list(filters: { status?: string; search?: string }) {
    const cached = await failedEventsCacheService.getList(
      filters.status,
      filters.search
    );

    if (cached) {
      return cached;
    }

    const data = await failedEventRepository.list(filters);
    await failedEventsCacheService.setList(filters.status, filters.search, data);
    return data;
  },

  async getById(id: string) {
    const cached = await failedEventsCacheService.getById(id);

    if (cached) {
      return cached;
    }

    const data = await failedEventRepository.findById(id);
    if (data) {
      await failedEventsCacheService.setById(id, data);
    }

    return data;
  },

  async counts() {
    const cached = await failedEventsCacheService.getMetrics();
    if (cached) {
      return cached;
    }

    const data = await failedEventRepository.counts();
    await failedEventsCacheService.setMetrics(data);
    return data;
  }
};