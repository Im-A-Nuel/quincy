"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

const RESET: CSSProperties = {
  transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * Subtle magnetic 3D tilt that follows the cursor - a small premium touch for
 * a hero CTA. No-op on touch devices (no hover) and under reduced-motion.
 */
export function TiltWrapper({
  children,
  className = "",
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>(RESET);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(600px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) scale(1.04)`,
      transition: "transform 0.06s linear",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setStyle(RESET)}
      className={`inline-block ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
