"use client";

import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

/**
 * Detects whether the app is running inside the MiniPay in-app browser and
 * auto-connects the injected provider when it is.
 *
 * MiniPay injects `window.ethereum.isMiniPay === true`. In that environment we
 * connect silently so the user never sees a wallet-connect step (FR-01).
 */
export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [checked, setChecked] = useState(false);
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const eth = (window as any).ethereum;
    const detected = Boolean(eth?.isMiniPay);
    setIsMiniPay(detected);
    setChecked(true);

    if (detected) {
      // Auto-connect: no manual step inside MiniPay.
      connect({ connector: connectors[0] ?? injected() });
    }
  }, [connect, connectors]);

  return { isMiniPay, checked };
}
