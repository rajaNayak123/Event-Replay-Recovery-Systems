import { generateEventId } from "../utils/ids";
import { OrderCreatedEvent } from "./types";

export function createOrderCreatedEvent(input: {
  orderId: string;
  tenantId: string;
  amount: number;
  currency: string;
  shouldFailInventory?: boolean;
}): OrderCreatedEvent {
  return {
    eventId: generateEventId(),
    eventType: "order.created",
    orderId: input.orderId,
    tenantId: input.tenantId,
    timestamp: new Date().toISOString(),
    payload: {
      amount: input.amount,
      currency: input.currency,
      shouldFailInventory: input.shouldFailInventory ?? false
    },
    meta: {
      source: "api",
      retryCount: 0,
      isReplay: false
    }
  };
}