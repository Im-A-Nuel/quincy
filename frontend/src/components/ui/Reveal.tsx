"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Scroll-reveal wrapper: fades + slides children in as they enter the
 * viewport, and reverses (hides) them as they leave it in either direction -
 * so scrolling back up past a section re-hides it, matching how it first
 * appeared. Pure CSS transition (inline style, not utility classes, so the
 * two states never fight over the `transform` property), so both directions
 * animate smoothly.
 */
export function Reveal({
  children,
  delayMs = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  /** Stagger delay in ms, for sequencing multiple Reveal siblings. */
  delayMs?: number;
  /** Starting vertical offset in px before it settles into place. */
  y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : `translateY(${y}px)`,
    transitionProperty: "opacity, transform",
    transitionDuration: "700ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: inView ? `${delayMs}ms` : "0ms",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
