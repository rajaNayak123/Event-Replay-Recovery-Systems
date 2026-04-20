"use client";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-6">
      <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-500/10 p-8">
        <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
        <p className="mt-3 text-sm text-red-100">
          {error.message || "Unexpected frontend error"}
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}