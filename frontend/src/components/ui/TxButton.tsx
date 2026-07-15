"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

/** Primary button that shows a spinner and label swap while a tx is pending. */
export function TxButton({
  pending,
  pendingLabel = "Confirm in wallet…",
  children,
  className = "",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: string;
  children: ReactNode;
}) {
  return (
    <button
      className={`btn-primary ${className}`}
      disabled={pending || disabled}
      {...props}
    >
      <span
        key={pending ? "pending" : "idle"}
        className="inline-flex animate-fade-in items-center gap-2"
      >
        {pending && <Spinner className="h-4 w-4" />}
        {pending ? pendingLabel : children}
      </span>
    </button>
  );
}
