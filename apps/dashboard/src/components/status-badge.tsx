import { FailedEventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusMap: Record<FailedEventStatus, string> = {
  FAILED: "bg-red-500/15 text-red-300 border-red-500/30",
  REPLAY_PENDING: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  REPLAYED: "bg-green-500/15 text-green-300 border-green-500/30",
  REPLAY_FAILED: "bg-orange-500/15 text-orange-300 border-orange-500/30"
};

export function StatusBadge({ status }: { status: FailedEventStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
        statusMap[status]
      )}
    >
      {status}
    </span>
  );
}