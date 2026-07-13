"use client";

import { useToast } from "@/components/toast/ToastContext";

/** Copies `text` to the clipboard and toasts confirmation. */
export function CopyButton({
  text,
  label = "Copied to clipboard",
  className = "",
  children,
}: {
  text: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const toast = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <button
      onClick={copy}
      aria-label="Copy"
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
      <CopyGlyph />
    </button>
  );
}

function CopyGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M6 15H5a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v1" />
    </svg>
  );
}
