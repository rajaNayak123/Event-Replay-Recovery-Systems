import Link from "next/link";
import { FailedEvent } from "@/lib/types";
import { formatDate, truncate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ReplayButton } from "./replay-button";

export function FailedEventsTable({ events }: { events: FailedEvent[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Event ID</th>
              <th className="px-4 py-3 font-medium">Event Type</th>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Tenant ID</th>
              <th className="px-4 py-3 font-medium">Error</th>
              <th className="px-4 py-3 font-medium">Retry Count</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const replayDisabled =
                event.status !== "FAILED" && event.status !== "REPLAY_FAILED";

              return (
                <tr key={event.id} className="border-b border-white/5 text-slate-200">
                <td className="px-4 py-4">
                  <div className="flex min-w-45 flex-col gap-2">
                    <Link
                      href={`/failed-events/${event.id}`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-slate-300 hover:bg-white/5"
                    >
                      View
                    </Link>
                    <ReplayButton id={event.id} disabled={replayDisabled} />
                  </div>
                </td>
                  <td className="px-4 py-4">{event.eventType}</td>
                  <td className="px-4 py-4">{event.orderId || "-"}</td>
                  <td className="px-4 py-4">{event.tenantId}</td>
                  <td className="max-w-70 px-4 py-4 text-slate-400">
                    {event.errorMessage}
                  </td>
                  <td className="px-4 py-4">{event.retryCount}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {formatDate(event.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/failed-events/${event.id}`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                      >
                        View
                      </Link>
                      <ReplayButton id={event.id} disabled={replayDisabled} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}