"use client";

import { signIn } from "next-auth/react";
import { Github, Mail, Lock, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { authenticate } from "./actions";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Event Replay System
          </h1>
          <p className="mt-2 text-white/60">
            Sign in to manage and recover failed events
          </p>
        </div>

        <form action={dispatch} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 flex-shrink text-xs text-white/20 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div>
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
          >
            <Github className="h-5 w-5" />
            GitHub
          </button>
        </div>

        <div className="text-center text-sm text-white/40">
          Secure authentication powered by Auth.js
        </div>
      </div>
    </div>
  );
}
