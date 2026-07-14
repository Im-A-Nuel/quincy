"use client";

import { useEffect, useState } from "react";
import { ExploreIcon } from "@/components/ui/icons";

/** Debounced search input for bounty titles. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search bounties…",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className="relative">
      <ExploreIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-black/[0.06] bg-white py-3 pl-11 pr-4 text-sm shadow-soft outline-none transition-colors placeholder:text-gray-400 focus:border-quincy-300 focus:ring-2 focus:ring-quincy-100"
      />
    </div>
  );
}
