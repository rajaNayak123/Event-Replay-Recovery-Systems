export type FailedEventStatus =
  | "FAILED"
  | "REPLAY_PENDING"
  | "REPLAYED"
  | "REPLAY_FAILED";

export type ReplayLogStatus =
  | "REQUESTED"
  | "SUCCEEDED"
  | "FAILED"
  | "SKIPPED_ALREADY_PROCESSED";

export type FailedEvent = {
  id: string;
  eventId: string;
  eventType: string;
  tenantId: string;
  streamName: string;
  orderId?: string | null;
  originalPayload: Record<string, unknown>;
  errorMessage: string;
  retryCount: number;
  status: FailedEventStatus;
  firstFailedAt: string;
  lastFailedAt: string;
  replayedAt?: string | null;
  replayRequestedBy?: string | null;
  replayMetadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ReplayLog = {
  id: string;
  failedEventId: string;
  eventId: string;
  requestedBy: string;
  status: ReplayLogStatus;
  requestPayload?: Record<string, unknown> | null;
  resultPayload?: Record<string, unknown> | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FailedEventDetail = FailedEvent & {
  replayLogs: ReplayLog[];
};

export type MetricsResponse = {
  failedEventsByStatus: Array<{
    status: FailedEventStatus;
    _count: number;
  }>;
};

export type CreateOrderResponse = {
  order: {
    id: string;
    orderNumber: string;
    tenantId: string;
    amount: string | number;
    currency: string;
    status: string;
    inventoryStatus: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  event: {
    eventId: string;
    eventType: string;
    orderId: string;
    tenantId: string;
    timestamp: string;
    payload: {
      amount: number;
      currency: string;
      shouldFailInventory?: boolean;
    };
  };
};