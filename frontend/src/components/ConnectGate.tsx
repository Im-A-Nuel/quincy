"use client";

import { useAccount } from "wagmi";
import type { ReactNode } from "react";
import { WalletButton } from "./WalletButton";
import { EmptyState } from "./ui/EmptyState";
import { WalletArt } from "./illustrations/spot";

/** Renders children only when a wallet is connected; otherwise prompts connect. */
export function ConnectGate({
  message = "Connect your wallet to continue.",
  children,
}: {
  message?: string;
  children: ReactNode;
}) {
  const { isConnected } = useAccount();
  if (isConnected) return <>{children}</>;
  return (
    <EmptyState
      art={<WalletArt />}
      title="Wallet not connected"
      hint={message}
      action={<WalletButton />}
    />
  );
}
