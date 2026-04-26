export const dynamic = "force-dynamic";
import { prisma } from "../../lib/prisma";
import { LoginForm } from "../../components/login-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  const resolvedSearchParams = await searchParams;
  const isSetupSuccess = resolvedSearchParams.setup === "success";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        {isSetupSuccess && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Admin account created successfully! You can now sign in.
          </div>
        )}

        <LoginForm />

        {adminCount === 0 && (
          <div className="text-center">
            <p className="text-sm text-slate-400">
              No admin account found.{" "}
              <Link
                href="/setup"
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Run first-time setup
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
