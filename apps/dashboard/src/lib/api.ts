import {
  CreateOrderResponse,
  FailedEvent,
  FailedEventDetail,
  MetricsResponse
} from "./types";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> || {})
  };

  let fetchUrl = `${API_BASE_URL}${path}`;

  // If on server, try to get the session token from cookies
  if (typeof window === "undefined") {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("authjs.session-token")?.value || cookieStore.get("__Secure-authjs.session-token")?.value;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.log(e)
      // Cookies might not be available in some contexts
    }
  } else {
    // If on client, use the local proxy to include the session token securely
    if (path.startsWith("/api/")) {
      fetchUrl = path.replace("/api/", "/api/proxy/");
    } else {
      fetchUrl = `/api/proxy${path}`;
    }
  }

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
  return fetchJson(`/api/failed-events/${id}/replay`, {
    method: "POST"
  });
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