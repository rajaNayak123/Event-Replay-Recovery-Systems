export type BaseEvent<TPayload = Record<string, unknown>> = {
  eventId: string;
  eventType: string;
  orderId: string;
  tenantId: string;
  timestamp: string;
  payload: TPayload;
  meta?: {
    source?: string;
    replayOfFailedEventId?: string;
    replayRequestedBy?: string;
    originalStream?: string;
    retryCount?: number;
    isReplay?: boolean;
  };
};

export type OrderCreatedPayload = {
  amount: number;
  currency: string;
  shouldFailInventory?: boolean;
};

export type OrderCreatedEvent = BaseEvent<OrderCreatedPayload> & {
  eventType: "order.created";
};

export type ReplayRequestEvent = {
  replayRequestId: string;
  failedEventId: string;
  requestedBy: string;
  requestedAt: string;
  event: BaseEvent;
};