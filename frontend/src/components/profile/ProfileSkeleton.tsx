const bar = "rounded bg-gray-200/70 animate-pulse";

/** Placeholder for the profile page while reputation loads. */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl bg-gray-200/70 p-6 animate-pulse">
        <div className="mx-auto h-16 w-16 rounded-full bg-white/40" />
        <div className="mx-auto mt-3 h-4 w-28 rounded bg-white/40" />
        <div className="mx-auto mt-2 h-3 w-20 rounded bg-white/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className={`h-20 ${bar}`} />
        <div className={`h-20 ${bar}`} />
      </div>
      <div className={`h-16 ${bar}`} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-24 ${bar}`} />
        ))}
      </div>
    </div>
  );
}
