/** A single labelled statistic tile on the profile page. */
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
