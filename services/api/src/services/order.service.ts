import { RedisEventBus, STREAMS, createOrderCreatedEvent, generateOrderNumber, orderRepository } from "shared";

export const orderService = {
  async createOrder(input: {
    tenantId: string;
    amount: number;
    currency: string;
    shouldFailInventory?: boolean;
  }) {
    const order = await orderRepository.create({
      tenantId: input.tenantId,
      amount: input.amount,
      currency: input.currency,
      orderNumber: generateOrderNumber(),
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

    const bus = new RedisEventBus();
    await bus.publish(STREAMS.ORDERS, event);

    return { order, event };
  }
};