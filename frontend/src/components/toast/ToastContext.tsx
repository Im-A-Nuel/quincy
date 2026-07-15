"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: number;
  variant: ToastVariant;
  message: string;
  /** True while the exit animation plays; Toaster removes it once done. */
  leaving?: boolean;
}

interface ToastApi {
  toasts: Toast[];
  push: (variant: ToastVariant, message: string) => void;
  /** Start the exit animation (click-to-dismiss, or the auto-dismiss timer). */
  dismiss: (id: number) => void;
  /** Hard-remove once the exit animation finishes playing. */
  remove: (id: number) => void;
}

const ToastCtx = createContext<ToastApi | null>(null);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    // Safety net in case onAnimationEnd doesn't fire (e.g. animation disabled).
    setTimeout(() => remove(id), 260);
  }, [remove]);

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = ++counter;
      setToasts((list) => [...list, { id, variant, message }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, push, dismiss, remove }), [toasts, push, dismiss, remove]);
  return <ToastCtx.Provider value={value}>{children}</ToastCtx.Provider>;
}

/** Fire toasts: `const toast = useToast(); toast.success("Done")`. */
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return {
    success: (m: string) => ctx.push("success", m),
    error: (m: string) => ctx.push("error", m),
    info: (m: string) => ctx.push("info", m),
  };
}

export function useToastState() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToastState must be used within ToastProvider");
  return ctx;
}
