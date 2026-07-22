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
import { useT } from "@/lib/i18n/LanguageContext";

const TABS = [
  { key: "open", labelKey: "tabOpen" },
  { key: "in_progress", labelKey: "tabInProgress" },
  { key: "completed", labelKey: "tabCompleted" },
] as const;

function MyList({ address }: { address: string }) {
  const t = useT();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("open");
  const { data, isLoading } = useBounties({ involves: address, status: tab });
  const { containerRef, setItemRef, rect } = useSlidingIndicator(tab);

  return (
    <>
      <div ref={containerRef} className="segmented-track mt-4">
        {rect && (
          <div
            className="absolute inset-y-0 my-auto h-9 rounded-full bg-gradient-primary shadow-md transition-all duration-300 ease-spring"
            style={{ left: rect.left, width: rect.width }}
          />
        )}
        {TABS.map((tItem) => {
          const active = tab === tItem.key;
          return (
            <button
              key={tItem.key}
              ref={setItemRef(tItem.key)}
              type="button"
              onClick={() => setTab(tItem.key)}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(`my.${tItem.labelKey}`)}
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
            title={t("my.empty")}
            hint={t("my.emptyHint")}
            action={
              <Link href="/bounties" className="btn-primary">
                {t("common.exploreBounties")}
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}

export default function MyBountiesPage() {
  const t = useT();
  const { address, isConnected } = useAccount();

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold text-gray-900">{t("my.title")}</h1>
      <p className="mt-1 text-sm text-gray-500">{t("my.subtitle")}</p>

      {isConnected && address ? (
        <MyList address={address} />
      ) : (
        <div className="mt-6">
          <ConnectGate message={t("my.connectMessage")}>
            <div />
          </ConnectGate>
        </div>
      )}
    </AppShell>
  );
}
