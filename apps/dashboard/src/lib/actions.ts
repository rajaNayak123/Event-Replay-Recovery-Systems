"use server";

import { fetchJson } from "./api-client";
import { CreateOrderResponse } from "./types";
import { revalidatePath } from "next/cache";

export async function createOrder(input: {
  tenantId: string;
  amount: number;
  currency: string;
  shouldFailInventory?: boolean;
}) {
  const result = await fetchJson<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input)
  });
  
  revalidatePath("/");
  return result;
}

export async function replayFailedEvent(id: string, scheduledAt?: string) {
  const result = await fetchJson(`/api/failed-events/${id}/replay`, { 
    method: "POST",
    body: JSON.stringify({ scheduledAt })
  });

  revalidatePath("/");
  revalidatePath("/failed-events");
  revalidatePath(`/failed-events/${id}`);
  
  return result;
}
