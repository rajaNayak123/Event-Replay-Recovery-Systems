import {
  KafkaEventBus,
  TOPICS,
  createOrderCreatedEvent,
  generateOrderNumber,
  orderRepository
} from "shared";

export const orderService = {
  async createOrder(input: {
    tenantId: string;
    amount: number;
    currency: string;
    shouldFailInventory?: boolean;
    idempotencyKey?: string;
    traceId?: string;
  }) {
    // Check for idempotency to prevent duplicates
    if (input.idempotencyKey) {
      const existing = await orderRepository.findByIdempotencyKey(input.idempotencyKey);
      if (existing) {
        return { 
          order: existing, 
          event: null, 
          message: "Order already exists (idempotent)",
          isDuplicate: true 
        };
      }
    }

    const order = await orderRepository.create({
      tenantId: input.tenantId,
      amount: input.amount,
      currency: input.currency,
      orderNumber: generateOrderNumber(),
      idempotencyKey: input.idempotencyKey,
      metadata: {
        shouldFailInventory: input.shouldFailInventory ?? false
      }
    });

    const event = createOrderCreatedEvent({
      orderId: order.id,
      tenantId: input.tenantId,
      amount: input.amount,
      currency: input.currency,
      shouldFailInventory: input.shouldFailInventory
    });

    const bus = new KafkaEventBus();

    await bus.publish(TOPICS.ORDER_CREATED, event.eventId, event, {
      eventId: event.eventId,
      eventType: event.eventType,
      tenantId: event.tenantId,
      ...(input.traceId ? { "x-trace-id": input.traceId } : {})
    });

    return { order, event };
  }
};