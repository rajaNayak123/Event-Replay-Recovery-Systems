"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 500);
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
    >
      {loading ? "Refreshing..." : "Refresh"}
    </button>
  );
}