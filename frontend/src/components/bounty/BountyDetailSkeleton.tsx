const bar = "rounded bg-gray-200/70 animate-pulse";

/** Placeholder for the bounty detail receipt while it loads. */
export function BountyDetailSkeleton() {
  return (
    <div className="mt-3 space-y-4">
      <div className="card-float">
        <div className="mx-auto mb-4 flex justify-center gap-2">
          <div className={`h-5 w-20 ${bar}`} />
          <div className={`h-5 w-16 ${bar}`} />
        </div>
        <div className={`mx-auto h-3 w-16 ${bar}`} />
        <div className={`mx-auto mt-2 h-9 w-40 ${bar}`} />
        <div className={`mx-auto mt-4 h-7 w-52 rounded-full ${bar}`} />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className={`h-4 w-20 ${bar}`} />
              <div className={`h-4 w-28 ${bar}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="card space-y-2">
        <div className={`h-4 w-1/2 ${bar}`} />
        <div className={`h-3 w-full ${bar}`} />
        <div className={`h-3 w-5/6 ${bar}`} />
      </div>
      <div className={`h-12 w-full rounded-full ${bar}`} />
    </div>
  );
}
