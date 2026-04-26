import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { getMetrics, getFailedEvents } from "@/lib/api";
import { FailedEventsTable } from "@/components/failed-events-table";
import { EmptyState } from "@/components/empty-state";
import { CreateOrderForm } from "@/components/create-order-form";
import { RefreshButton } from "@/components/refresh-button";
import { ArrowRight, Zap } from "lucide-react";

export default async function HomePage() {
  const [metrics, failedEvents] = await Promise.all([
    getMetrics(),
    getFailedEvents()
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 px-8 py-8">
        <header className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">System Dashboard</h2>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
            <RefreshButton />
          </div>
        </header>

        {/* Hero Section / Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="h-32 w-32 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Event Simulation Console</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                Trigger synthetic order events to test the resiliency of the replay and recovery system. 
                Simulate database failures, inventory timeouts, or consumer crashes.
              </p>
              <CreateOrderForm />
            </div>
          </div>
          
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border-indigo-500/10">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Live Throughput</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Real-time processing metrics for the last 24 hours.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Success Rate</span>
                    <span className="text-xs font-bold text-emerald-400">98.2%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.2%]" />
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Recovery Latency</span>
                    <span className="text-xs font-bold text-indigo-400">~1.2s</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[30%]" />
                 </div>
              </div>
            </div>
            <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all">
              View Network Stats <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </section>

        <section className="mb-8">
          <StatsCards metrics={metrics} />
        </section>

        <section className="glass-panel rounded-3xl overflow-hidden">
          <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
            <div>
              <h3 className="text-lg font-bold text-white">Critical Exceptions</h3>
              <p className="text-xs text-slate-500 mt-1">Events requiring manual intervention or replay.</p>
            </div>
            <Link
              href="/failed-events"
              className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
            >
              View Analysis <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="p-2">
            {failedEvents.length === 0 ? (
              <div className="py-12">
                <EmptyState />
              </div>
            ) : (
              <FailedEventsTable events={failedEvents.slice(0, 10)} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

