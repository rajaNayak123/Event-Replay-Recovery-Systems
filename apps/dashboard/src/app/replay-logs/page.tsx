import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { ReplayLogsTable } from "@/components/replay-logs-table";
import { getReplayLogs } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

async function LogsList({ status }: { status?: string }) {
  const logs = await getReplayLogs({ status });
  
  if (logs.length === 0) {
    return (
      <EmptyState 
        title="No replay logs found" 
        description="When you replay a failed event, the details will appear here." 
      />
    );
  }
  
  return <ReplayLogsTable logs={logs} />;
}

export default async function ReplayLogsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section>
          <h2 className="text-2xl font-semibold text-white">Replay Logs</h2>
          <p className="mt-2 text-sm text-slate-400">
            Historical record of all event replay attempts and their outcomes.
          </p>
        </section>

        <section className="mt-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500/50" />
            </div>
          }>
            <LogsList status={params.status} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

