/** Completion ratio bar: completed / claimed as a hunter. */
export function SuccessRate({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="card">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Hunter success rate</span>
        <span className="font-bold text-quincy-700">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-quincy-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {completed} of {total} claimed bounties completed
      </p>
    </div>
  );
}
