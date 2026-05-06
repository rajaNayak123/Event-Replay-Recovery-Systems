import { redis } from "../redis/client";
import { logger } from "../logging/logger";

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN"
}

export interface CircuitBreakerOptions {
  threshold: number;
  timeoutMs: number;
  keyPrefix: string;
}

export class RedisCircuitBreaker {
  private readonly threshold: number;
  private readonly timeoutMs: number;
  private readonly keyPrefix: string;

  constructor(options: CircuitBreakerOptions) {
    this.threshold = options.threshold;
    this.timeoutMs = options.timeoutMs;
    this.keyPrefix = options.keyPrefix;
  }

  private get stateKey() { return `${this.keyPrefix}:state`; }
  private get failureKey() { return `${this.keyPrefix}:failures`; }

  async getState(): Promise<CircuitState> {
    const state = await redis.get(this.stateKey);
    if (!state) {
      // If no state exists but failures exist, we might still be CLOSED
      // If no state exists and no failures exist, we are CLOSED
      return CircuitState.CLOSED;
    }
    return state as CircuitState;
  }

  async recordSuccess() {
    await redis.del(this.failureKey);
    await redis.del(this.stateKey);
  }

  async recordFailure() {
    const failures = await redis.incr(this.failureKey);
    if (failures >= this.threshold) {
      await redis.set(this.stateKey, CircuitState.OPEN, "PX", this.timeoutMs);
      logger.error({ keyPrefix: this.keyPrefix, failures }, "Circuit breaker OPENED");
    }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const state = await this.getState();
    if (state === CircuitState.OPEN) {
      logger.warn({ keyPrefix: this.keyPrefix }, "Circuit breaker is OPEN - failing fast");
      throw new Error(`Circuit breaker is OPEN for ${this.keyPrefix}`);
    }

    try {
      const result = await fn();
      await this.recordSuccess();
      return result;
    } catch (error) {
      await this.recordFailure();
      throw error;
    }
  }
}
