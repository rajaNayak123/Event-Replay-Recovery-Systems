import { env } from "../config/env";
import { orderRepository } from "../repositories/order.repository";

export const inventoryService = {
  async reserve(orderId: string, shouldFailInventory?: boolean) {
    const failByFlag = shouldFailInventory === true;
    const failByMode =
      env.INVENTORY_FAILURE_MODE === "always" ||
      (env.INVENTORY_FAILURE_MODE === "random" &&
        Math.random() * 100 < env.INVENTORY_FAILURE_PERCENT);

    if (failByFlag || failByMode) {
      throw new Error("Inventory reservation failed intentionally for demo");
    }

    await orderRepository.updateStatuses(orderId, {
      inventoryStatus: "RESERVED",
      status: "COMPLETED"
    });

    return { ok: true };
  }
};