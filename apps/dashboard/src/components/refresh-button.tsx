"use client";

import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { RefreshCw, Play, Pause } from "lucide-react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [autoRefresh, setAutoRefresh] = useState(false);

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, router]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
          autoRefresh 
            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
            : "border-white/5 bg-white/5 text-slate-500 hover:bg-white/10"
        }`}
        title={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh (10s)"}
      >
        {autoRefresh ? (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </div>
            Live
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Auto
          </>
        )}
      </button>

      <button
        onClick={handleRefresh}
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin text-indigo-400" : ""}`} />
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}