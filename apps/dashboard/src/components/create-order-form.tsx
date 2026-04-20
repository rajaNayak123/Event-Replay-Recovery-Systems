"use client";

import { useState } from "react";
import { createOrder } from "@/lib/api";
import { ActionToast } from "./action-toast";
import { useRouter } from "next/navigation";

export function CreateOrderForm() {
  const router = useRouter();

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

    try {
      setLoading(true);
      setMessage(null);

      const result = await createOrder({
        tenantId,
        amount: Number(amount),
        currency,
        shouldFailInventory
      });

      setMessage({
        type: "success",
        text: `Order ${result.order.orderNumber} created and event ${result.event.eventId} published`
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Order creation failed"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Create Demo Order</h3>
        <p className="mt-1 text-sm text-slate-400">
          Create a fake order and trigger the backend event flow.
        </p>
      </div>

      {message ? <ActionToast type={message.type} message={message.text} /> : null}

      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Tenant ID</label>
          <input
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Currency</label>
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900 px-4 py-2">
          <input
            id="failInventory"
            type="checkbox"
            checked={shouldFailInventory}
            onChange={(e) => setShouldFailInventory(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="failInventory" className="text-sm text-slate-300">
            Intentionally fail inventory
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}