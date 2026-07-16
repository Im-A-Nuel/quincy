"use client";

import { SORT_OPTIONS, type SortOption } from "@/lib/constants";
import { useSlidingIndicator } from "@/hooks/useSlidingIndicator";

/** Compact sort selector with a sliding background pill. */
export function SortChips({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (next: SortOption) => void;
}) {
  const { containerRef, setItemRef, rect } = useSlidingIndicator(value);

  return (
    <div ref={containerRef} className="segmented-track">
      {rect && (
        <div
          className="absolute inset-y-0 my-auto h-9 rounded-full bg-gradient-primary shadow-md transition-all duration-300 ease-spring"
          style={{ left: rect.left, width: rect.width }}
        />
      )}
      {SORT_OPTIONS.map((s) => {
        const active = value === s.value;
        return (
          <button
            key={s.value}
            ref={setItemRef(s.value)}
            type="button"
            onClick={() => onChange(s.value)}
            className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              active ? "text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
