import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { getMetrics, getFailedEvents } from "@/lib/api";
import { FailedEventsTable } from "@/components/failed-events-table";
import { EmptyState } from "@/components/empty-state";
import { CreateOrderForm } from "@/components/create-order-form";
import { RefreshButton } from "@/components/refresh-button";

export default async function HomePage() {
  const [metrics, failedEvents] = await Promise.all([
    getMetrics(),
    getFailedEvents()
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Overview</h2>
            <p className="mt-2 text-sm text-slate-400">
              Monitor failed events, trigger demo failures, and replay safely.
            </p>
          </div>

          <RefreshButton />
        </section>

        <section className="mt-6">
          <StatsCards metrics={metrics} />
        </section>

        <section className="mt-8">
          <CreateOrderForm />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Failed Events</h3>
            <Link
              href="/failed-events"
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              View all
            </Link>
          </div>

          {failedEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <FailedEventsTable events={failedEvents.slice(0, 10)} />
          )}
        </section>
      </main>
    </div>
  );
}
