import { DashboardHeader } from "@/components/dashboard-header";
import { Settings as SettingsIcon, Database, Shield, Zap } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="mt-2 text-sm text-slate-400">
            Configure recovery thresholds, notification channels, and API access.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="glass-panel rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Recovery Policies</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Max Retries</p>
                  <p className="text-xs text-slate-500">Number of automatic retry attempts before failure.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-indigo-300">5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Backoff Multiplier</p>
                  <p className="text-xs text-slate-500">Exponential backoff factor for retries.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-indigo-300">2.0</span>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">API Security</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">JWT Expiration</p>
                  <p className="text-xs text-slate-500">Session duration for dashboard users.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300">24h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Token Verification</p>
                  <p className="text-xs text-slate-500">HMAC SHA-256 enabled.</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-3xl p-8 md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Database className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Kafka Infrastructure</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Brokers</p>
                <p className="text-sm font-mono text-slate-300">kafka:29092</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Topics</p>
                <p className="text-sm font-mono text-slate-300">4 active</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Consumer Groups</p>
                <p className="text-sm font-mono text-slate-300">3 active</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
