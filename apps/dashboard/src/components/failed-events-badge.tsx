"use client";

import { useEffect, useState } from "react";
import { getFailedCount } from "@/lib/actions";

export function FailedEventsBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      const c = await getFailedCount();
      setCount(c);
    }
    
    fetchCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === null || count === 0) {
    return null;
  }

  return (
    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500/10 px-1 text-[10px] font-bold text-rose-500 border border-rose-500/20 animate-in fade-in zoom-in duration-300">
      {count > 99 ? "99+" : count}
    </span>
  );
}
