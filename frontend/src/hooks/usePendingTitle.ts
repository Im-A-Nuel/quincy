"use client";

import { useEffect } from "react";

/** While `pending`, swaps the browser tab title to a status message so users
 *  waiting on a wallet confirmation notice it even from another tab. */
export function usePendingTitle(pending: boolean, label = "Confirm in wallet…") {
  useEffect(() => {
    if (!pending || typeof document === "undefined") return;
    const original = document.title;
    document.title = `⏳ ${label}`;
    return () => {
      document.title = original;
    };
  }, [pending, label]);
}
