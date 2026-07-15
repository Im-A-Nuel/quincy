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
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-3xl border border-dashed border-quincy-200 bg-white/60 px-6 py-12 text-center">
      {art ? (
        <div className="animate-scale-in mb-4 w-32 [animation-delay:0.1s]">{art}</div>
      ) : (
        <div className="animate-scale-in mb-3 text-4xl [animation-delay:0.1s]" aria-hidden>
          {icon ?? "📭"}
        </div>
      )}
      <p className="font-semibold text-gray-800">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-gray-500">{hint}</p>}
      {action && <div className="animate-fade-in mt-5 [animation-delay:0.2s]">{action}</div>}
    </div>
  );
}
