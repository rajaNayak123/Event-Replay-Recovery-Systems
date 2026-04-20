export default function Loading() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-6">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <h2 className="mt-4 text-lg font-semibold text-white">Loading dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">
            Fetching failed events and recovery data...
          </p>
        </div>
      </div>
    );
  }