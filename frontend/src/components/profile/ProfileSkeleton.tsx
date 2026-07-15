/** Placeholder for the profile page while reputation loads. */
export function ProfileSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="skeleton rounded-4xl p-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-white/40" />
        <div className="mx-auto mt-3 h-4 w-28 rounded bg-white/40" />
        <div className="mx-auto mt-2 h-3 w-20 rounded bg-white/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="skeleton h-20 rounded-3xl" />
        <div className="skeleton h-20 rounded-3xl" />
      </div>
      <div className="skeleton h-16 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
