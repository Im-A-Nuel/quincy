"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useCusdBalance } from "@/hooks/useCusd";
import { fromCusdUnits } from "@/lib/units";
import { shortAddress } from "@/lib/format";
import { WalletButton } from "@/components/WalletButton";
import { PlusIcon, ExploreIcon, WalletIcon } from "@/components/ui/icons";

/** Gradient hero card summarizing the connected wallet + quick actions. */
export function WalletSummary() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useCusdBalance();

  const balanceText =
    isConnected && balance !== undefined
      ? `${Number(fromCusdUnits(balance)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "-";

  return (
    <section className="overflow-hidden rounded-4xl bg-gradient-primary p-6 text-white shadow-float">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
          <WalletIcon className="h-5 w-5" />
          {isConnected ? shortAddress(address) : "Not connected"}
        </div>
        {!isConnected && <WalletButton />}
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/70">cUSD balance</p>
        <p className="mt-1 text-4xl font-extrabold tracking-tight">
          {balanceText} <span className="text-xl font-bold text-white/80">cUSD</span>
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
