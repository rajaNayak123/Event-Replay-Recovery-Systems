import { FailedEventStatus, ReplayLogStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type CombinedStatus = FailedEventStatus | ReplayLogStatus;

const statusConfig: Record<CombinedStatus, { classes: string, label: string, dot: string }> = {
  FAILED: { 
    classes: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]", 
    label: "Critical Failure",
    dot: "bg-rose-500"
  },
  REPLAY_PENDING: { 
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]", 
    label: "Processing Replay",
    dot: "bg-amber-500 animate-pulse"
  },
  REPLAYED: { 
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]", 
    label: "Successfully Replayed",
    dot: "bg-emerald-500"
  },
  REPLAY_FAILED: { 
    classes: "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.1)]", 
    label: "Replay Exhausted",
    dot: "bg-orange-500"
  },
  REQUESTED: {
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]",
    label: "Replay Requested",
    dot: "bg-blue-500"
  },
  SUCCEEDED: {
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]",
    label: "Replay Succeeded",
    dot: "bg-emerald-500"
  },
  SKIPPED_ALREADY_PROCESSED: {
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_12px_rgba(100,116,139,0.1)]",
    label: "Already Processed",
    dot: "bg-slate-500"
  }
};

export function StatusBadge({ status }: { status: CombinedStatus }) {
  const config = statusConfig[status] || {
    classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    label: status,
    dot: "bg-slate-500"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105",
        config.classes
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_4px_currentColor]", config.dot)} />
      {config.label}
    </span>
  );
}