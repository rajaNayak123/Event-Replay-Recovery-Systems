import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({ 
  title = "No failed events found", 
  description = "Create an order with inventory failure enabled to see failed events here.",
  actionHref = "/",
  actionLabel = "Go to overview"
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
      >
        {actionLabel}
      </Link>
    </div>
  );
}