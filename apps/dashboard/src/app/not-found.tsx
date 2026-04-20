import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-6">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Page not found</h2>
        <p className="mt-3 text-sm text-slate-400">
          The page or failed event you requested could not be found.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}