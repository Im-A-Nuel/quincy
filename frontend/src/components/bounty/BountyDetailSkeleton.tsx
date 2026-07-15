/** Placeholder for the bounty detail receipt while it loads. */
export function BountyDetailSkeleton() {
  return (
    <div className="mt-3 space-y-4 animate-fade-in">
      <div className="card-float">
        <div className="mx-auto mb-4 flex justify-center gap-2">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
        </div>
        <div className="skeleton mx-auto h-3 w-16 rounded" />
        <div className="skeleton mx-auto mt-2 h-9 w-40 rounded" />
        <div className="skeleton mx-auto mt-4 h-7 w-52 rounded-full" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="skeleton h-4 w-20 rounded" />
              <div className="skeleton h-4 w-28 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="card space-y-2">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
      </div>
      <div className="skeleton h-12 w-full rounded-full" />
    </div>
  );
}
