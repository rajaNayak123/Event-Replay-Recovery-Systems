import { ReplayLog } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { User, Calendar, Database, AlertCircle } from "lucide-react";

export function ReplayLogsTable({ logs }: { logs: ReplayLog[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs sm:text-sm border-separate border-spacing-0">
        <thead>
          <tr className="bg-white/[0.01]">
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Replay Info</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">Requested By</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 text-center">Status</th>
            <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 text-right">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-5 border-b border-white/5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-indigo-400" />
                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
                      {log.eventId.slice(0, 12)}...
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">Event Replay Request</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-slate-600" />
                    <span className="text-[10px] text-slate-600 font-medium">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <User className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200">{log.user?.name || "System"}</span>
                    <span className="text-[10px] text-slate-500">{log.user?.email || "system@internal"}</span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-5 border-b border-white/5 text-center">
                <StatusBadge status={log.status} />
              </td>

              <td className="px-6 py-5 border-b border-white/5 text-right">
                {log.errorMessage ? (
                  <div className="flex items-center justify-end gap-2 text-rose-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-[10px] font-medium max-w-[200px] truncate">{log.errorMessage}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium italic">No errors reported</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
