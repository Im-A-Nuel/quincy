import { STATUS_META } from "@/lib/constants";
import type { BountyStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: BountyStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.badge}`}
    >
      {meta.label}
    </span>
  );
}
