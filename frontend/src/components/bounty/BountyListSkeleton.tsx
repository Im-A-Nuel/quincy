/** Placeholder cards shown while the bounty list loads. */
export function BountyListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="mt-3 flex justify-between">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>
          <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
