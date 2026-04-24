"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function LoginPage() {
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

        <div className="mt-8">
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-white/40">
          Secure authentication powered by Auth.js
        </div>
      </div>
    </div>
  );
}
