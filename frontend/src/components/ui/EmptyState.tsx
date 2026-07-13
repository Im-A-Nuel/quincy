import type { ReactNode } from "react";

export function EmptyState({
  art,
  icon,
  title,
  hint,
  action,
}: {
  /** Preferred: a spot illustration. Falls back to `icon` emoji. */
  art?: ReactNode;
  icon?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-quincy-200 bg-white/60 px-6 py-12 text-center">
      {art ? (
        <div className="mb-4 w-32">{art}</div>
      ) : (
        <div className="mb-3 text-4xl" aria-hidden>
          {icon ?? "📭"}
        </div>
      )}
      <p className="font-semibold text-gray-800">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-gray-500">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
