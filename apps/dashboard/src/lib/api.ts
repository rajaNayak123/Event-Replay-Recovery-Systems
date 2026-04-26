"use server";

import { auth } from "./auth";
import {
  CreateOrderResponse,
  FailedEvent,
  FailedEventDetail,
  MetricsResponse,
  ReplayLog
} from "./types";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

/**
 * All API communication is now handled via Server Actions.
 * This ensures that sensitive tokens (like the accessToken JWT) 
 * never leave the server and are not visible in the browser's DevTools.
 */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> || {})
  };

  // Always use server-side auth() to retrieve the token securely
  const session = await auth();
  const accessToken = (session as any)?.accessToken;

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }


  const fetchUrl = `${API_BASE_URL}${path}`;

  const res = await fetch(fetchUrl, {
    ...init,
    cache: "no-store",
    headers
  });


  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      throw new Error(data?.message || `Request failed: ${res.status}`);
    }

    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function getFailedEvents(params?: {
  status?: string;
  search?: string;
}) {
  const query = new URLSearchParams();

  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return fetchJson<FailedEvent[]>(`/api/failed-events${suffix}`);
}

export async function getFailedEventById(id: string) {
  return fetchJson<FailedEventDetail>(`/api/failed-events/${id}`);
}

export async function replayFailedEvent(id: string, scheduledAt?: string) {
  return fetchJson(`/api/failed-events/${id}/replay`, { 
    method: "POST",
    body: JSON.stringify({ scheduledAt })
  });
}


export async function getMetrics() {
  return fetchJson<MetricsResponse>("/api/metrics");
}

export async function getReplayLogs(params?: {
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return fetchJson<ReplayLog[]>("/api/replay-logs" + suffix);
}

export async function createOrder(input: {
  tenantId: string;
  amount: number;
  currency: string;
  shouldFailInventory?: boolean;
}) {
  return fetchJson<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input)
  });
}