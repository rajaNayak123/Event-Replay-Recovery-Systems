"use client";

import { useState, useTransition } from "react";
import { createOrder } from "@/lib/actions";
import { ActionToast } from "./action-toast";
import { useRouter } from "next/navigation";
import { Send, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export function CreateOrderForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tenantId, setTenantId] = useState("tenant-demo");
  const [amount, setAmount] = useState("1499");
  const [currency, setCurrency] = useState("INR");
  const [shouldFailInventory, setShouldFailInventory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!tenantId.trim()) {
      setMessage({ type: "error", text: "Tenant ID is required" });
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage({ type: "error", text: "Amount must be a positive number" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const result = await createOrder({
        tenantId,
        amount: parsedAmount,
        currency,
        shouldFailInventory
      });

      setMessage({
        type: "success",
        text: `Order ${result.order.orderNumber} created — event ${result.event.eventId} published`
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Order creation failed"
      });
    } finally {
      setLoading(false);
    }
  }

  const isActuallyLoading = loading || isPending;

  return (
    <div className="relative">
      {message && (
        <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
          <ActionToast type={message.type} message={message.text} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Tenant ID</label>
          <input
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
            className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Amount</label>
          <div className="relative">
             <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all pl-9"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">$</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Resiliency Mode</label>
          <button
            type="button"
            onClick={() => setShouldFailInventory(!shouldFailInventory)}
            className={`w-full flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
              shouldFailInventory 
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {shouldFailInventory ? (
              <><AlertTriangle className="h-4 w-4" /> Fail Inventory</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Happy Path</>
            )}
          </button>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isActuallyLoading}
            className="w-full group relative flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
          >
            {isActuallyLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                Dispatch Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}