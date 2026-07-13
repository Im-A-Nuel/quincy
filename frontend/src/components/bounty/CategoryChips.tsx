"use client";

import { CATEGORIES } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";
import { CATEGORY_ICON } from "@/components/ui/categoryIcons";

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
      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICON[c.value];
        return (
          <Chip key={c.value} active={value === c.value} onClick={() => onChange(c.value)}>
            <Icon className="h-4 w-4" />
            {c.label}
          </Chip>
        );
      })}
    </div>
  );
}
