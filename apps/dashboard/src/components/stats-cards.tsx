import { MetricsResponse } from "@/lib/types";

export function StatsCards({ metrics }: { metrics: MetricsResponse }) {
  const map = new Map(metrics.failedEventsByStatus.map((item) => [item.status, item._count]));

  const cards = [
    { label: "Failed", value: map.get("FAILED") ?? 0 },
    { label: "Replay Pending", value: map.get("REPLAY_PENDING") ?? 0 },
    { label: "Replayed", value: map.get("REPLAYED") ?? 0 },
    { label: "Replay Failed", value: map.get("REPLAY_FAILED") ?? 0 }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}