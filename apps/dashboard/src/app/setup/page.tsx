export const dynamic = "force-dynamic";
import { prisma } from "../../lib/prisma";
import { SetupForm } from "../../components/setup-form";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  if (adminCount > 0) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            First-time Setup
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create your administrative account to get started
          </p>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          This is a one-time setup process. Only the first registered user will be granted ADMIN privileges via this page.
        </div>

        <SetupForm />
      </div>
    </div>
  );
}
