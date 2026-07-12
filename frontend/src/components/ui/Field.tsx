import type { ReactNode } from "react";

/** Labelled form field wrapper with optional error text. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-2xl border border-black/[0.06] bg-soft-gray/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-quincy-300 focus:bg-white focus:ring-2 focus:ring-quincy-100";

export const inputClass = inputBase;
