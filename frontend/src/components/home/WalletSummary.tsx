"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useTokenBalance } from "@/hooks/useToken";
import { fromTokenUnits } from "@/lib/units";
import { cusdAddress, celoTokenAddress } from "@/lib/chains";
import { shortAddress } from "@/lib/format";
import { WalletButton } from "@/components/WalletButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { PlusIcon, ExploreIcon, WalletIcon } from "@/components/ui/icons";
import { useCountUp } from "@/hooks/useCountUp";
import { useT } from "@/lib/i18n/LanguageContext";

function formatBalance(value?: bigint): string {
  return value !== undefined
    ? Number(fromTokenUnits(value)).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "-";
}

/** Gradient hero card summarizing the connected wallet + quick actions. */
export function WalletSummary() {
  const t = useT();
  const { address, isConnected } = useAccount();
  const { data: cusdBalance } = useTokenBalance(cusdAddress);
  const { data: celoBalance } = useTokenBalance(celoTokenAddress);

  const cusdNum = isConnected && cusdBalance !== undefined ? Number(fromTokenUnits(cusdBalance)) : 0;
  const animatedCusd = useCountUp(cusdNum);
  const cusdText =
    isConnected && cusdBalance !== undefined
      ? animatedCusd.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "-";

  return (
    <section className="animate-scale-in overflow-hidden rounded-4xl bg-gradient-primary p-6 text-white shadow-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <WalletIcon className="h-5 w-5" />
          {isConnected && address ? (
            <CopyButton text={address} label={t("common.addressCopied")} className="text-white/80 hover:text-white">
              {shortAddress(address)}
            </CopyButton>
          ) : (
            t("wallet.notConnected")
          )}
        </div>
        {!isConnected && <WalletButton />}
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/70">{t("wallet.cusdBalance")}</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">
          {cusdText} <span className="text-xl font-bold text-white/80">cUSD</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-white/80">
          {isConnected ? formatBalance(celoBalance) : "-"} CELO
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
        >
          <PlusIcon className="h-5 w-5" /> Post
        </Link>
        <Link
          href="/bounties"
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
        >
          <ExploreIcon className="h-5 w-5" /> Explore
        </Link>
      </div>
    </section>
  );
}
