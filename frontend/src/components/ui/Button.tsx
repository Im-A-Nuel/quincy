import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  soft: "btn-soft",
};

const SIZE: Record<Size, string> = {
  sm: "!px-4 !py-2 text-xs",
  md: "",
  lg: "!px-6 !py-3 text-base",
};

/** Pill button in the Quincy soft style. */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      className={`${VARIANT[variant]} ${SIZE[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
