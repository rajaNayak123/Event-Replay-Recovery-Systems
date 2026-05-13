import { DashboardHeader } from "@/components/dashboard-header";
import { Activity, BarChart3, Globe, Zap, Clock } from "lucide-react";

export default function NetworkStatsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">Network & Infrastructure</h2>
          <p className="mt-2 text-sm text-slate-400">
            Real-time throughput, latency metrics, and distributed system connectivity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
           <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Zap className="h-5 w-5 text-indigo-400" />
                 </div>
                 <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-wider">Optimal</span>
              </div>
              <div>
                 <p className="text-2xl font-bold text-white">1.2s</p>
                 <p className="text-xs text-slate-500 mt-1">Avg. Replay Latency</p>
              </div>
           </div>

           <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">24h Peak</span>
              </div>
              <div>
                 <p className="text-2xl font-bold text-white">450 msg/s</p>
                 <p className="text-xs text-slate-500 mt-1">Kafka Throughput</p>
              </div>
           </div>

           <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Globe className="h-5 w-5 text-purple-400" />
                 </div>
                 <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20 uppercase tracking-wider">Active</span>
              </div>
              <div>
                 <p className="text-2xl font-bold text-white">3 Nodes</p>
                 <p className="text-xs text-slate-500 mt-1">Distributed Cluster</p>
              </div>
           </div>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden">
           <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white">Topic Performance</h3>
              <Clock className="h-4 w-4 text-slate-500" />
           </div>
           <div className="p-8 space-y-8">
              {[
                { name: "order-events", throughput: "120 msg/s", lag: "0", status: "Healthy" },
                { name: "inventory-failures", throughput: "45 msg/s", lag: "12", status: "Healthy" },
                { name: "replay-commands", throughput: "5 msg/s", lag: "0", status: "Healthy" },
                { name: "dead-letter-queue", throughput: "2 msg/s", lag: "0", status: "Warning" },
              ].map((topic) => (
                <div key={topic.name} className="flex items-center justify-between group">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{topic.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mt-1">Partition Count: 3</span>
                   </div>
                   <div className="flex items-center gap-12">
                      <div className="text-right">
                         <p className="text-xs font-bold text-slate-300">{topic.throughput}</p>
                         <p className="text-[10px] text-slate-500">Throughput</p>
                      </div>
                      <div className="text-right min-w-[60px]">
                         <p className={`text-xs font-bold ${topic.lag !== "0" ? "text-amber-400" : "text-slate-300"}`}>{topic.lag}</p>
                         <p className="text-[10px] text-slate-500">Lag</p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px]">
                         <div className={`h-1.5 w-1.5 rounded-full ${topic.status === "Healthy" ? "bg-emerald-500" : "bg-amber-500"}`} />
                         <span className={`text-[10px] font-bold ${topic.status === "Healthy" ? "text-emerald-500/80" : "text-amber-500/80"}`}>{topic.status}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
