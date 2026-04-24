"use client";

import { useState, useEffect } from "react";
import { replayFailedEvent } from "@/lib/api";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  disabled?: boolean;
};

export function ReplayButton({ id, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  // auto-clear toast after 3 seconds so it doesn't linger in table cells
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleReplay() {
    try {
      setLoading(true);
      setMessage(null);
      await replayFailedEvent(id);
      setMessage({ type: "success", text: "Replay requested" });
      setShowConfirm(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Replay failed"
      });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleReplay}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Replaying..." : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfirm(true)}
        disabled={disabled || loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Replay
      </button>

      {message && (
        <div
          className={`absolute bottom-full left-0 mb-1 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}