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
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleReplay() {
    try {
      setLoading(true);
      setMessage(null);
      await replayFailedEvent(id, scheduledAt || undefined);
      setMessage({ 
        type: "success", 
        text: scheduledAt ? "Replay scheduled" : "Replay requested" 
      });
      setShowConfirm(false);
      setIsScheduling(false);
      setScheduledAt("");
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Replay failed"
      });
    } finally {
      setLoading(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-slate-900/50 p-4 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">
            {isScheduling ? "Select Replay Time" : "Confirm Immediate Replay"}
          </label>
          
          {isScheduling && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              min={(() => {
                const now = new Date();
                const offset = now.getTimezoneOffset() * 60000;
                return new Date(now.getTime() - offset).toISOString().slice(0, 16);
              })()}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            disabled={loading || (isScheduling && !scheduledAt)}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : isScheduling ? "Schedule" : "Replay Now"}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              setIsScheduling(false);
              setScheduledAt("");
            }}
            disabled={loading}
            className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        
        {!isScheduling && (
          <button
            onClick={() => setIsScheduling(true)}
            className="text-center text-xs text-slate-400 hover:text-emerald-400"
          >
            Schedule for later instead?
          </button>
        )}
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
          className={`absolute bottom-full left-0 mb-1 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium z-10 ${
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