"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

/** Thin gradient progress line pinned to the very top of the viewport. */
export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-primary transition-[width] duration-150 ease-soft"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
