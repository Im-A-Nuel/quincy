"use client";

import { useAccount } from "wagmi";
import type { ReactNode } from "react";
import { WalletButton } from "./WalletButton";
import { EmptyState } from "./ui/EmptyState";
import { WalletArt } from "./illustrations/spot";
import { useT } from "@/lib/i18n/LanguageContext";

/** Renders children only when a wallet is connected; otherwise prompts connect. */
export function ConnectGate({
  message,
  children,
}: {
  message?: string;
  children: ReactNode;
}) {
  const t = useT();
  const { isConnected } = useAccount();
  if (isConnected) return <>{children}</>;
  return (
    <EmptyState
      art={<WalletArt />}
      title={t("connectGate.title")}
      hint={message ?? t("connectGate.defaultMessage")}
      action={<WalletButton />}
    />
  );
}
