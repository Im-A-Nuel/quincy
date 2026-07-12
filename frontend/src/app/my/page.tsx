"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { useBounties } from "@/hooks/useBounties";

const TABS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
] as const;

function MyList({ address }: { address: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("open");
  const { data, isLoading } = useBounties({ involves: address, status: tab });

  return (
    <>
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <BountyListSkeleton count={2} />
        ) : data && data.bounties.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {data.bounties.map((b) => (
              <BountyCard key={b.id} bounty={b} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🗂️"
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
