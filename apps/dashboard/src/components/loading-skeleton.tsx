export function LoadingSkeleton() {
    return (
      <div className="space-y-4">
        <div className="h-12 animate-pulse rounded-lg bg-white/10" />
        <div className="h-64 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }