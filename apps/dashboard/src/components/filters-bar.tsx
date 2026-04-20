"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FAILED_EVENT_STATUSES } from "@/lib/constants";
import { useState } from "react";

export function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const selectedStatus = searchParams.get("status") || "";

  function updateQuery(next: { status?: string; search?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.status !== undefined) {
      if (next.status) params.set("status", next.status);
      else params.delete("status");
    }

    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }

    router.push(`/failed-events?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by eventId or orderId"
        className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500"
      />

      <select
        value={selectedStatus}
        onChange={(e) => updateQuery({ status: e.target.value })}
        className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
      >
        <option value="">All statuses</option>
        {FAILED_EVENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        onClick={() => updateQuery({ search })}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Apply
      </button>

      <button
        onClick={() => {
          setSearch("");
          router.push("/failed-events");
        }}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
      >
        Reset
      </button>
    </div>
  );
}