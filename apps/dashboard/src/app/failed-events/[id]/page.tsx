import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { EventDetailCard } from "@/components/event-detail-card";
import { getFailedEventById } from "@/lib/api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FailedEventDetailPage({ params }: Props) {
  const { id } = await params;

  try {
    const event = await getFailedEventById(id);

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

          <EventDetailCard event={event} />
        </main>
      </div>
    );
  } catch {
    notFound();
  }
}