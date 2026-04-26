import { getSession } from "next-auth/react";
import {
  CreateOrderResponse,
  FailedEvent,
  FailedEventDetail,
  MetricsResponse
} from "./types";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

/**
 * Note on Authentication for Next.js 16 App Router:
 * The most secure approach for communicating with external APIs is using Server Actions, 
 * as the AUTH_SECRET and tokens stay on the server. However, for compatibility with 
 * existing client-side logic, we are using getSession() to inject the token into 
 * client-side fetch calls.
 */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> || {})
  };

  // Inject authentication token if session exists
  let accessToken: string | undefined;

  if (typeof window !== "undefined") {
    const session = await getSession();
    accessToken = (session as any)?.accessToken;
  } else {
    // Use server-side auth() for Server Components/Actions
    const { auth } = await import("./auth");
    const session = await auth();
    accessToken = (session as any)?.accessToken;
  }

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

export async function replayFailedEvent(id: string) {
  return fetchJson(`/api/failed-events/${id}/replay`, { method: "POST" });
}

export async function getMetrics() {
  return fetchJson<MetricsResponse>("/api/metrics");
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