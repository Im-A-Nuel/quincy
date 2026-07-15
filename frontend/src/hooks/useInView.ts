"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is in the viewport, toggling back to false once
 * it leaves (in either direction) - "mirror" mode. Used for scroll-reveal:
 * elements appear scrolling down, and hide again scrolling back past them.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px", ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
