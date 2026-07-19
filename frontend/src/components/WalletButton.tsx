"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { shortAddress } from "@/lib/format";
import { Avatar } from "@/components/ui/Avatar";
import { CopyButton } from "@/components/ui/CopyButton";
import { fromTokenUnits } from "@/lib/units";
import { useCusdBalance } from "@/hooks/useCusd";

/**
 * Connect button; once connected, opens a dropdown (balance, copy address,
 * view profile, disconnect) instead of disconnecting on a single click.
 * Inside MiniPay the wallet is already auto-connected (see useMiniPay), so
 * this mostly serves the fallback browser case.
 */
export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useCusdBalance();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isConnected || !address) {
    return (
      <button onClick={() => connect({ connector: injected() })} className="btn-primary">
        Connect wallet
      </button>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost border border-gray-200"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar address={address} size="sm" ring={false} />
        {shortAddress(address)}
      </button>

      {open && (
        <div
          role="menu"
          className="animate-scale-in absolute right-0 top-full z-40 mt-2 w-64 origin-top-right rounded-3xl border border-black/[0.05] bg-surface p-2 shadow-float"
        >
          <div className="flex items-center gap-3 rounded-2xl p-3">
            <Avatar address={address} size="md" />
            <div className="min-w-0">
              <CopyButton
                text={address}
                label="Address copied"
                className="text-sm font-semibold text-gray-900"
              >
                {shortAddress(address)}
              </CopyButton>
              <p className="mt-0.5 text-xs text-gray-400">
                {balance !== undefined
                  ? `${Number(fromTokenUnits(balance)).toLocaleString(undefined, { maximumFractionDigits: 2 })} cUSD`
                  : "…"}
              </p>
            </div>
          </div>

          <div className="my-1 border-t border-black/[0.05]" />

          <Link
            href={`/profile/${address}`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-quincy-50 hover:text-quincy-700"
          >
            View profile
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="block w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
