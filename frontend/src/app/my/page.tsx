"use client";

import { useState } from "react";
import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";

const TABS = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
] as const;

/** My Bounties — grouped by status. Data wiring lands in a follow-up. */
export default function MyBountiesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("open");

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold text-gray-900">My Bounties</h1>
      <p className="mt-1 text-sm text-gray-500">Everything you&apos;ve posted or claimed.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <Chip key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        <ConnectGate message="Connect your wallet to see your bounties.">
          <EmptyState
            icon="🗂️"
            title="Nothing here yet"
            hint="Your bounties in this state will show up here."
          />
        </ConnectGate>
      </div>
    </AppShell>
  );
}
