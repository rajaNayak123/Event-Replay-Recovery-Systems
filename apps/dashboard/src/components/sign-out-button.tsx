"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
    >
      <LogOut size={16} />
      <span>Sign Out</span>
    </button>
  );
}
