"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSlidingIndicator } from "@/hooks/useSlidingIndicator";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { useBounties } from "@/hooks/useBounties";
import { EmptyBoxArt } from "@/components/illustrations/spot";

const TABS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
] as const;

function MyList({ address }: { address: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("open");
  const { data, isLoading } = useBounties({ involves: address, status: tab });
  const { containerRef, setItemRef, rect } = useSlidingIndicator(tab);

  return (
    <>
      <div ref={containerRef} className="relative mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {rect && (
          <div
            className="absolute inset-y-0 my-auto h-9 rounded-full bg-gray-900 shadow-md transition-all duration-300 ease-spring"
            style={{ left: rect.left, width: rect.width }}
          />
        )}
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              ref={setItemRef(t.key)}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <BountyListSkeleton count={2} />
        ) : data && data.bounties.length > 0 ? (
          <div className="stagger grid gap-3 md:grid-cols-2">
            {data.bounties.map((b) => (
              <BountyCard key={b.id} bounty={b} />
            ))}
          </div>
        ) : (
          <EmptyState
            art={<EmptyBoxArt />}
            title="Nothing here yet"
            hint="Bounties you post or claim will show up in these tabs."
            action={
              <Link href="/bounties" className="btn-primary">
                Explore bounties
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}

export default function MyBountiesPage() {
  const { address, isConnected } = useAccount();

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold text-gray-900">My Bounties</h1>
      <p className="mt-1 text-sm text-gray-500">Everything you&apos;ve posted or claimed.</p>

      {isConnected && address ? (
        <MyList address={address} />
      ) : (
        <div className="mt-6">
          <ConnectGate message="Connect your wallet to see your bounties.">
            <div />
          </ConnectGate>
        </div>
      )}
    </AppShell>
  );
}
