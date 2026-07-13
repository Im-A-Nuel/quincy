import type { ReactNode } from "react";

/** A single labelled statistic tile on the profile page. */
export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card text-center">
      {icon && (
        <div className="mb-2 flex justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-quincy-50 text-quincy-600">
            {icon}
          </span>
        </div>
      )}
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
