import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Pill chip used for filters and swipeable category rows. */
export function Chip({
  active = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${active ? "chip-active" : "chip-inactive"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
