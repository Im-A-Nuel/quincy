import type { ReactNode } from "react";

/** Receipt-style key/value row with a hairline divider. */
export function InfoRow({
  label,
  children,
  divider = true,
}: {
  label: string;
  children: ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        divider ? "border-b border-black/[0.05]" : ""
      }`}
    >
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{children}</span>
    </div>
  );
}
