import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="border-b border-white/10 bg-black/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Event Replay Dashboard</h1>
          <p className="text-sm text-slate-400">
            Failed event inspection, replay, and recovery
          </p>
        </div>

        <div className="flex items-center gap-6">
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

          {session?.user && (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <span className="text-sm text-slate-400">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}