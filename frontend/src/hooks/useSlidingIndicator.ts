"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures the DOM position of whichever chip/tab is active so a background
 * pill can glide between them (segmented-control feel) instead of each item
 * flatly swapping its own background color.
 */
export function useSlidingIndicator(activeKey: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = itemRefs.current[activeKey];
      if (el) setRect({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeKey]);

  const setItemRef = (key: string) => (el: HTMLElement | null) => {
    itemRefs.current[key] = el;
  };

  return { containerRef, setItemRef, rect };
}
