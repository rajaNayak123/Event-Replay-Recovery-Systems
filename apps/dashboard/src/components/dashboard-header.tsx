import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="border-b border-white/10 bg-black/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Event Replay Dashboard</h1>
          <p className="text-sm text-slate-400">
            Failed event inspection, replay, and recovery
          </p>
        </div>

        <nav className="flex items-center gap-3 text-sm text-slate-300">
          <Link
            href="/"
            className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/5"
          >
            Overview
          </Link>
          <Link
            href="/failed-events"
            className="rounded-md border border-white/10 px-3 py-2 hover:bg-white/5"
          >
            Failed Events
          </Link>
        </nav>
      </div>
    </header>
  );
}