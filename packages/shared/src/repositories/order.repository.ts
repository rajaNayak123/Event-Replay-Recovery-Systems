import { prisma } from "../db/prisma";

export const orderRepository = {
  create(data: {
    tenantId: string;
    amount: number;
    currency: string;
    orderNumber: string;
    metadata?: Record<string, unknown>;
  }) {
    return prisma.order.create({
      data: {
        tenantId: data.tenantId,
        amount: data.amount,
        currency: data.currency,
        orderNumber: data.orderNumber,
        metadata: data.metadata
      }
    });
  },

  updateStatuses(orderId: string, data: { paymentStatus?: string; inventoryStatus?: string; status?: string }) {
    return prisma.order.update({
      where: { id: orderId },
      data
    });
  },

  findById(orderId: string) {
    return prisma.order.findUnique({ where: { id: orderId } });
  }
};