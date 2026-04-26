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

  const cards = [
    { 
      label: "Critical Failures", 
      value: map.get("FAILED") ?? 0, 
      icon: AlertCircle, 
      color: "rose",
      trend: "+2% from last hour"
    },
    { 
      label: "Awaiting Replay", 
      value: map.get("REPLAY_PENDING") ?? 0, 
      icon: Clock, 
      color: "amber",
      trend: "Priority queue active"
    },
    { 
      label: "Successfully Replayed", 
      value: map.get("REPLAYED") ?? 0, 
      icon: CheckCircle2, 
      color: "emerald",
      trend: "85% recovery rate"
    },
    { 
      label: "Exhausted Retries", 
      value: map.get("REPLAY_FAILED") ?? 0, 
      icon: XCircle, 
      color: "red",
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
              <div className={`rounded-2xl bg-${card.color}-500/10 p-3 border border-${card.color}-500/20`}>
                <Icon className={`h-6 w-6 text-${card.color}-400`} />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2">
              <Activity className="h-3 w-3 text-slate-600" />
              <span className="text-[10px] font-medium text-slate-500">{card.trend}</span>
            </div>

            {/* Decorative background glow */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-${card.color}-500/5 blur-3xl group-hover:bg-${card.color}-500/10 transition-colors`} />
          </div>
        );
      })}
    </div>
  );
}