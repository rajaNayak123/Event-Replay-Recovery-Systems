"use client";

import { useState } from "react";
import { replayFailedEvent } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ActionToast } from "./action-toast";

type Props = {
  id: string;
  disabled?: boolean;
};

export function ReplayButton({ id, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const router = useRouter();

  async function handleReplay() {
    try {
      setLoading(true);
      setMessage(null);

      await replayFailedEvent(id, "dashboard-user");

      setMessage({
        type: "success",
        text: "Replay requested successfully"
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Replay request failed"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {message ? <ActionToast type={message.type} message={message.text} /> : null}

      <button
        onClick={handleReplay}
        disabled={disabled || loading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Replaying..." : "Replay"}
      </button>
    </div>
  );
}