"use client";

import { CATEGORIES, SORT_OPTIONS, type SortOption } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";

export interface FilterState {
  category: BountyCategory | "";
  sort: SortOption;
}

export function BountyFilters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filter by category"
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
        value={value.category}
        onChange={(e) =>
          onChange({ ...value, category: e.target.value as BountyCategory | "" })
        }
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.emoji} {c.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort bounties"
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as SortOption })}
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
