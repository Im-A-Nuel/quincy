"use client";

import { useToastState, type ToastVariant } from "./ToastContext";
import { CheckIcon } from "@/components/ui/icons";

const STYLE: Record<ToastVariant, { ring: string; icon: string; dot: string }> = {
  success: { ring: "border-emerald-200", icon: "text-emerald-600", dot: "bg-emerald-500" },
  error: { ring: "border-red-200", icon: "text-red-600", dot: "bg-red-500" },
  info: { ring: "border-quincy-200", icon: "text-quincy-600", dot: "bg-quincy-500" },
};

/** Renders the active toast stack, above the mobile bottom nav. */
export function Toaster() {
  const { toasts, dismiss } = useToastState();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6 md:left-auto md:right-6 md:items-end"
    >
      {toasts.map((t) => {
        const s = STYLE[t.variant];
        return (
          <button
            key={t.id}
            onClick={() => dismiss(t.id)}
            aria-label={`Dismiss: ${t.message}`}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border ${s.ring} bg-surface px-4 py-3 text-left shadow-float animate-fade-up`}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.dot} text-white`}>
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-gray-800">{t.message}</span>
          </button>
        );
      })}
    </div>
  );
}
