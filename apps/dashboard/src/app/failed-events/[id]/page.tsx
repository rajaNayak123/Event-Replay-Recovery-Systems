import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { EventDetailCard } from "@/components/event-detail-card";
import { getFailedEventById } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function EventDetailWrapper({ id }: { id: string }) {
  try {
    const event = await getFailedEventById(id);
    return <EventDetailCard event={event} />;
  } catch {
    notFound();
  }
}

export default async function FailedEventDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <Link
            href="/failed-events"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Back to failed events
          </Link>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500/50" />
          </div>
        }>
          <EventDetailWrapper id={id} />
        </Suspense>
      </main>
    </div>
  );
}