"use client";

import { CATEGORIES } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";
import { CATEGORY_ICON } from "@/components/ui/categoryIcons";
import { useSlidingIndicator } from "@/hooks/useSlidingIndicator";

/** Swipeable category filter chips (including an "All" reset), with a sliding
 *  background pill that glides to whichever chip is active. */
export function CategoryChips({
  value,
  onChange,
}: {
  value: BountyCategory | "";
  onChange: (next: BountyCategory | "") => void;
}) {
  const { containerRef, setItemRef, rect } = useSlidingIndicator(value || "all");

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0"
    >
      {rect && (
        <div
          className="absolute inset-y-0 my-auto h-9 rounded-full bg-gray-900 shadow-md transition-all duration-300 ease-spring"
          style={{ left: rect.left, width: rect.width }}
        />
      )}

      <button
        ref={setItemRef("all")}
        type="button"
        onClick={() => onChange("")}
        className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          value === "" ? "text-white" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        All
      </button>

      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICON[c.value];
        const active = value === c.value;
        return (
          <button
            key={c.value}
            ref={setItemRef(c.value)}
            type="button"
            onClick={() => onChange(c.value)}
            className={`relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              active ? "text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
