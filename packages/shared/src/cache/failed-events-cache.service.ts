import { cacheKeys } from "./cache-keys";
import { cacheService } from "./cache.service";

export const failedEventsCacheService = {
  async getList(status?: string, search?: string) {
    return cacheService.getJson(cacheKeys.failedEventsList(status, search));
  },

  async setList(status: string | undefined, search: string | undefined, data: unknown) {
    return cacheService.setJson(cacheKeys.failedEventsList(status, search), data, 30);
  },

  async getById(id: string) {
    return cacheService.getJson(cacheKeys.failedEventById(id));
  },

  async setById(id: string, data: unknown) {
    return cacheService.setJson(cacheKeys.failedEventById(id), data, 30);
  },

  async getMetrics() {
    return cacheService.getJson(cacheKeys.failedEventMetrics());
  },

  async setMetrics(data: unknown) {
    return cacheService.setJson(cacheKeys.failedEventMetrics(), data, 20);
  },

  async invalidateAllLists() {
    return cacheService.delByPrefix("failed-events:list:");
  },

  async invalidateDetail(id: string) {
    return cacheService.del(cacheKeys.failedEventById(id));
  },

  async invalidateMetrics() {
    return cacheService.del(cacheKeys.failedEventMetrics());
  },

  async invalidateForFailedEvent(id: string) {
    await this.invalidateDetail(id);
    await this.invalidateAllLists();
    await this.invalidateMetrics();
  }
};