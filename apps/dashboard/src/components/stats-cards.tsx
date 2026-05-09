import { MetricsResponse } from "@/lib/types";
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Activity
} from "lucide-react";

export function StatsCards({ metrics }: { metrics: MetricsResponse }) {
  const map = new Map(metrics.failedEventsByStatus.map((item) => [item.status, item._count]));
  
  const replayed = map.get("REPLAYED") ?? 0;
  const replayFailed = map.get("REPLAY_FAILED") ?? 0;
  const totalResolutionAttempts = replayed + replayFailed;
  const recoveryRate = totalResolutionAttempts > 0 
    ? Math.round((replayed / totalResolutionAttempts) * 100) 
    : 0;

  const cards = [
    { 
      label: "Critical Failures", 
      value: map.get("FAILED") ?? 0, 
      icon: AlertCircle, 
      styles: {
        iconBg: "bg-rose-500/10",
        iconBorder: "border-rose-500/20",
        iconText: "text-rose-400",
        glow: "bg-rose-500/5 group-hover:bg-rose-500/10"
      },
      trend: "Real-time"
    },
    { 
      label: "Awaiting Replay", 
      value: map.get("REPLAY_PENDING") ?? 0, 
      icon: Clock, 
      styles: {
        iconBg: "bg-amber-500/10",
        iconBorder: "border-amber-500/20",
        iconText: "text-amber-400",
        glow: "bg-amber-500/5 group-hover:bg-amber-500/10"
      },
      trend: "Priority queue active"
    },
    { 
      label: "Successfully Replayed", 
      value: replayed, 
      icon: CheckCircle2, 
      styles: {
        iconBg: "bg-emerald-500/10",
        iconBorder: "border-emerald-500/20",
        iconText: "text-emerald-400",
        glow: "bg-emerald-500/5 group-hover:bg-emerald-500/10"
      },
      trend: `${recoveryRate}% recovery rate`
    },
    { 
      label: "Exhausted Retries", 
      value: replayFailed, 
      icon: XCircle, 
      styles: {
        iconBg: "bg-red-500/10",
        iconBorder: "border-red-500/20",
        iconText: "text-red-400",
        glow: "bg-red-500/5 group-hover:bg-red-500/10"
      },
      trend: "Manual audit required"
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
                <h4 className="mt-2 text-4xl font-black text-white tracking-tighter">
                  {card.value}
                </h4>
              </div>
              <div className={`rounded-2xl p-3 border ${card.styles.iconBg} ${card.styles.iconBorder}`}>
                <Icon className={`h-6 w-6 ${card.styles.iconText}`} />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <Activity className="h-3 w-3 text-slate-600" />
              <span className="text-[10px] font-medium text-slate-500">{card.trend}</span>
            </div>

            {/* Decorative background glow */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-3xl transition-colors ${card.styles.glow}`} />
          </div>
        );
      })}
    </div>
  );
}