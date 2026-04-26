import { DashboardHeader } from "@/components/dashboard-header";
import { EmptyState } from "@/components/empty-state";
import { ReplayLogsTable } from "@/components/replay-logs-table";
import { getReplayLogs } from "@/lib/api";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ReplayLogsPage({ searchParams }: Props) {
  const params = await searchParams;

  const logs = await getReplayLogs({
    status: params.status
  });

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
          {logs.length === 0 ? (
            <EmptyState 
              title="No replay logs found" 
              description="When you replay a failed event, the details will appear here." 
            />
          ) : (
            <ReplayLogsTable logs={logs} />
          )}
        </section>
      </main>
    </div>
  );
}
