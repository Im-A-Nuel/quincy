import type { ReactNode } from "react";

type Tint = "green" | "mint" | "blue" | "purple" | "indigo" | "pink" | "orange" | "yellow" | "gray";

const TINT: Record<Tint, string> = {
  green: "bg-soft-green text-emerald-600",
  mint: "bg-soft-mint text-teal-600",
  blue: "bg-soft-blue text-blue-600",
  purple: "bg-soft-purple text-purple-600",
  indigo: "bg-soft-indigo text-quincy-600",
  pink: "bg-soft-pink text-pink-600",
  orange: "bg-soft-orange text-orange-600",
  yellow: "bg-soft-yellow text-amber-600",
  gray: "bg-soft-gray text-gray-600",
};

const SIZE = {
  sm: "h-10 w-10 rounded-xl2 text-lg",
  md: "h-14 w-14 rounded-2xl text-2xl",
  lg: "h-16 w-16 rounded-3xl text-3xl",
};

/** Colorful squircle icon container, tinted softly - the reference's app-icon look. */
export function IconTile({
  tint = "green",
  size = "md",
  interactive = false,
  className = "",
  children,
}: {
  tint?: Tint;
  size?: keyof typeof SIZE;
  /** Adds hover-lift + press-scale, for tiles that sit inside a link/button. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center ${TINT[tint]} ${SIZE[size]} ${
        interactive
          ? "transition-all duration-200 ease-soft group-hover:-translate-y-1 group-hover:shadow-md group-active:scale-90 group-active:duration-100 group-active:ease-snappy"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
