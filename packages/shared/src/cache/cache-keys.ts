export const cacheKeys = {
    failedEventsList: (status?: string, search?: string) =>
      `failed-events:list:${status ?? "ALL"}:${search ?? "ALL"}`,
    failedEventById: (id: string) => `failed-events:detail:${id}`,
    failedEventMetrics: () => `failed-events:metrics`
  };