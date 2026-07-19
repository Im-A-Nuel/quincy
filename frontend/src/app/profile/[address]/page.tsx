"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { WalletArt } from "@/components/illustrations/spot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/profile/StatCard";
import { SuccessRate } from "@/components/profile/SuccessRate";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Achievements } from "@/components/profile/Achievements";
import { useProfile } from "@/hooks/useProfile";
import { formatToken } from "@/lib/format";
import { CoinIcon, TrophyIcon, TasksIcon, CheckIcon, LockIcon } from "@/components/ui/icons";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const address = params.address;
  const { data, isLoading, isError } = useProfile(address);

  return (
    <AppShell>
      {isLoading && <ProfileSkeleton />}

      {isError && (
        <EmptyState art={<WalletArt />} title="No activity yet" hint="This wallet hasn't posted or claimed any bounties." />
      )}

      {data && (
        <div className="space-y-6">
          <ProfileHeader address={address} completed={data.bountiesCompletedAsHunter} />

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Earned (cUSD)" value={formatToken(data.totalEarnedCusd, "cUSD")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label="Spent (cUSD)" value={formatToken(data.totalSpentCusd, "cUSD")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label="Earned (CELO)" value={formatToken(data.totalEarnedCelo, "CELO")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label="Spent (CELO)" value={formatToken(data.totalSpentCelo, "CELO")} icon={<CoinIcon className="h-5 w-5" />} />
          </div>

          <SuccessRate
            completed={data.bountiesCompletedAsHunter}
            total={data.bountiesClaimed}
          />

          <section>
            <SectionHeader title="Activity" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Posted" value={data.bountiesPosted} icon={<LockIcon className="h-5 w-5" />} />
              <StatCard label="Done as poster" value={data.bountiesCompletedAsPoster} icon={<CheckIcon className="h-5 w-5" />} />
              <StatCard label="Claimed" value={data.bountiesClaimed} icon={<TasksIcon className="h-5 w-5" />} />
              <StatCard label="Done as hunter" value={data.bountiesCompletedAsHunter} icon={<TrophyIcon className="h-5 w-5" />} />
            </div>
          </section>

          <section>
            <SectionHeader title="Achievements" />
            <Achievements rep={data} />
          </section>
        </div>
      )}
    </AppShell>
  );
}
