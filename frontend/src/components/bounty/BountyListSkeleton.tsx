/** Placeholder cards shown while the bounty list loads. */
export function BountyListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="mt-3 flex justify-between">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-3 w-12 rounded" />
          </div>
          <div className="skeleton mt-3 h-3 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}
