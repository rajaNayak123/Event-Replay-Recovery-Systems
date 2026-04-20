import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">No failed events found</h3>
      <p className="mt-2 text-sm text-slate-400">
        Create an order with inventory failure enabled to see failed events here.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        Go to overview
      </Link>
    </div>
  );
}