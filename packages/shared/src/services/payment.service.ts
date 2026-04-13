import { orderRepository } from "../repositories/order.repository";

export const paymentService = {
  async process(orderId: string) {
    await orderRepository.updateStatuses(orderId, {
      paymentStatus: "PROCESSED"
    });
    return { ok: true };
  }
};