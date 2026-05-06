import { env } from "../config/env";
import { orderRepository } from "../repositories/order.repository";
import { RedisCircuitBreaker } from "../utils/circuit-breaker";

const breaker = new RedisCircuitBreaker({
  threshold: 3,
  timeoutMs: 30000, // 30 seconds
  keyPrefix: "circuit:inventory"
});

export const inventoryService = {
  async reserve(orderId: string, shouldFailInventory?: boolean) {
    return breaker.execute(async () => {
      const failByFlag = shouldFailInventory === true;
      const failByMode =
        env.INVENTORY_FAILURE_MODE === "always" ||
        (env.INVENTORY_FAILURE_MODE === "random" &&
          Math.random() * 100 < env.INVENTORY_FAILURE_PERCENT);

      // Only fail if not explicitly told NOT to fail via the flag
      if (shouldFailInventory !== false && (failByFlag || failByMode)) {
        throw new Error("Inventory reservation failed intentionally for demo");
      }

      await orderRepository.updateStatuses(orderId, {
        inventoryStatus: "RESERVED",
        status: "COMPLETED"
      });

      return { ok: true };
    });
  }
};