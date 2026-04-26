import Link from "next/link";
import { FailedEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ReplayButton } from "./replay-button";
import { Eye, ChevronRight } from "lucide-react";

export function FailedEventsTable({ events }: { events: FailedEvent[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
        <thead>
          <tr className="bg-white/[0.01]">
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Event Details</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Error Context</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 text-center">Status</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const replayDisabled =
              event.status !== "FAILED" && event.status !== "REPLAY_FAILED";

            return (
              <tr key={event.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 border-b border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
                      {event.eventId.slice(0, 12)}...
                    </span>
                    <span className="text-sm font-bold text-white">{event.eventType}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-500 border border-white/5 uppercase">
                         ID: {event.orderId || "N/A"}
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-5 border-b border-white/5 max-w-md">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {event.errorMessage}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-slate-600" />
                      <span className="text-[10px] font-bold text-slate-500">Retry {event.retryCount}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-slate-600" />
                      <span className="text-[10px] font-bold text-slate-500">Tenant: {event.tenantId}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 border-b border-white/5 text-center">
                  <StatusBadge status={event.status} />
                </td>

                <td className="px-6 py-5 border-b border-white/5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/failed-events/${event.id}`}
                      className="flex items-center justify-center h-9 w-9 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                      title="Inspect Event"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <div className="h-9 w-[1px] bg-white/5 mx-1" />
                    <ReplayButton id={event.id} disabled={replayDisabled} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}