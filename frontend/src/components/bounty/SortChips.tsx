"use client";

import { SORT_OPTIONS, type SortOption } from "@/lib/constants";
import { Chip } from "@/components/ui/Chip";

/** Compact sort selector rendered as pill chips. */
export function SortChips({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (next: SortOption) => void;
}) {
  return (
    <div className="flex gap-2">
      {SORT_OPTIONS.map((s) => (
        <Chip key={s.value} active={value === s.value} onClick={() => onChange(s.value)}>
          {s.label}
        </Chip>
      ))}
    </div>
  );
}
