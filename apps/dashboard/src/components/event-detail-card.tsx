import { FailedEventDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ReplayButton } from "./replay-button";

export function EventDetailCard({ event }: { event: FailedEventDetail }) {
  const replayDisabled =
    event.status !== "FAILED" && event.status !== "REPLAY_FAILED";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Failed Event Details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Inspect failure context and request safe replay
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <StatusBadge status={event.status} />
            <ReplayButton id={event.id} disabled={replayDisabled} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info label="Event ID" value={event.eventId} />
          <Info label="Event Type" value={event.eventType} />
          <Info label="Order ID" value={event.orderId || "-"} />
          <Info label="Tenant ID" value={event.tenantId} />
          <Info label="Stream" value={event.streamName} />
          <Info label="Retry Count" value={String(event.retryCount)} />
          <Info label="First Failed At" value={formatDate(event.firstFailedAt)} />
          <Info label="Last Failed At" value={formatDate(event.lastFailedAt)} />
          <Info label="Replayed At" value={formatDate(event.replayedAt)} />
          <Info label="Replay Requested By" value={event.replayRequestedBy || "-"} />
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-300">Error Message</p>
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {event.errorMessage}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-300">Original Payload</p>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(event.originalPayload, null, 2)}
          </pre>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Replay Audit Logs</h3>
        <div className="mt-4 space-y-4">
          {event.replayLogs.length === 0 ? (
            <p className="text-sm text-slate-400">No replay logs yet.</p>
          ) : (
            event.replayLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{log.status}</p>
                    <p className="text-xs text-slate-400">
                      Requested by: {log.requestedBy}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                </div>

                {log.errorMessage ? (
                  <p className="mt-3 text-sm text-red-300">{log.errorMessage}</p>
                ) : null}

                {log.resultPayload ? (
                  <pre className="mt-3 overflow-x-auto rounded-md border border-white/10 bg-slate-900 p-3 text-xs text-slate-300">
                    {JSON.stringify(log.resultPayload, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm text-white">{value}</p>
    </div>
  );
}