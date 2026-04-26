import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";
import { Search, Bell, User } from "lucide-react";

export async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-8 bg-slate-950/20 backdrop-blur-md border-b border-white/5">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search events, orders, or replay IDs..."
            className="w-full rounded-full border border-white/5 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-slate-950" />
        </button>

        {session?.user && (
          <div className="flex items-center gap-4 border-l border-white/10 pl-5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{session.user.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-500">{session.user.email}</p>
            </div>
            
            <div className="group relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/10">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              
              {/* Simple dropdown indicator */}
              <div className="absolute top-full right-0 mt-2 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="rounded-xl border border-white/10 bg-slate-900 p-2 shadow-2xl min-w-40">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}