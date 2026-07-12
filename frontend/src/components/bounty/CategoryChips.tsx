"use client";

import { CATEGORIES } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";

/** Swipeable category filter chips (including an "All" reset). */
export function CategoryChips({
  value,
  onChange,
}: {
  value: BountyCategory | "";
  onChange: (next: BountyCategory | "") => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0">
      <Chip active={value === ""} onClick={() => onChange("")}>
        All
      </Chip>
      {CATEGORIES.map((c) => (
        <Chip key={c.value} active={value === c.value} onClick={() => onChange(c.value)}>
          <span aria-hidden>{c.emoji}</span>
          {c.label}
        </Chip>
      ))}
    </div>
  );
}
