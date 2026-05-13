"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  Database,
  Terminal,
  Activity
} from "lucide-react";
import { FailedEventsBadge } from "./failed-events-badge";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Failed Events", href: "/failed-events", icon: AlertCircle },
  { name: "Replay Logs", href: "/replay-logs", icon: RefreshCw },
];

const secondaryNavigation = [
  { name: "Network Stats", href: "/network-stats", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-full border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
            <Database className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Event Replay</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {item.name}
                {item.name === "Failed Events" && <FailedEventsBadge />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />
              {item.name}
            </Link>
          ))}
          
          <div className="mt-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 border border-indigo-500/10">
            <p className="text-xs font-semibold text-indigo-300">Live Monitor</p>
            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
              Consuming events from 4 topics in real-time.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-wider">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
