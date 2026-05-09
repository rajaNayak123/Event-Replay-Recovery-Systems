import { env } from "../config/env";
import { orderRepository } from "../repositories/order.repository";
import { RedisCircuitBreaker } from "../utils/circuit-breaker";
import { logger } from "../logging/logger";

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

      const mustFail = shouldFailInventory !== false && (failByFlag || failByMode);

      // Simulate a real external service call using httpbin
      // If mustFail is true, we call a 503 endpoint to trigger the circuit breaker
      const url = `https://httpbin.org/status/${mustFail ? 503 : 200}`;
      
      logger.info({ orderId, url }, "Calling external inventory service");
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`External inventory service returned status ${response.status}`);
        }
      } catch (error) {
        logger.error({ orderId, error: (error as Error).message }, "External inventory service call failed");
        throw error;
      }

      await orderRepository.updateStatuses(orderId, {
        inventoryStatus: "RESERVED",
        status: "COMPLETED"
      });

      return { ok: true };
    });
  }
};