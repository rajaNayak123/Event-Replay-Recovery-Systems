import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { FailedEventsTable } from "@/components/failed-events-table";
import { FiltersBar } from "@/components/filters-bar";
import { getFailedEvents } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type Props = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

async function EventsList({ status, search }: { status?: string, search?: string }) {
  const events = await getFailedEvents({ status, search });
  return events.length === 0 ? <EmptyState /> : <FailedEventsTable events={events} />;
}

export default async function FailedEventsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section>
          <h2 className="text-2xl font-semibold text-white">Failed Events</h2>
          <p className="mt-2 text-sm text-slate-400">
            Search, filter, inspect, and replay failed distributed events.
          </p>
        </section>

        <section className="mt-6">
          <FiltersBar />
        </section>

        <section className="mt-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500/50" />
            </div>
          }>
            <EventsList status={params.status} search={params.search} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}