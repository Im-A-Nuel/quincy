import type { HTMLAttributes } from "react";

/** Floating white card. `float` gives a larger radius + softer elevation. */
export function Card({
  float = false,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { float?: boolean }) {
  return <div className={`${float ? "card-float" : "card"} ${className}`} {...props} />;
}
