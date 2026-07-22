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
import { useT } from "@/lib/i18n/LanguageContext";

export default function ProfilePage() {
  const t = useT();
  const params = useParams<{ address: string }>();
  const address = params.address;
  const { data, isLoading, isError } = useProfile(address);

  return (
    <AppShell>
      {isLoading && <ProfileSkeleton />}

      {isError && (
        <EmptyState art={<WalletArt />} title={t("profile.noActivity")} hint={t("profile.noActivityHint")} />
      )}

      {data && (
        <div className="space-y-6">
          <ProfileHeader address={address} completed={data.bountiesCompletedAsHunter} />

          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t("profile.earnedCusd")} value={formatToken(data.totalEarnedCusd, "cUSD")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label={t("profile.spentCusd")} value={formatToken(data.totalSpentCusd, "cUSD")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label={t("profile.earnedCelo")} value={formatToken(data.totalEarnedCelo, "CELO")} icon={<CoinIcon className="h-5 w-5" />} />
            <StatCard label={t("profile.spentCelo")} value={formatToken(data.totalSpentCelo, "CELO")} icon={<CoinIcon className="h-5 w-5" />} />
          </div>

          <SuccessRate
            completed={data.bountiesCompletedAsHunter}
            total={data.bountiesClaimed}
          />

          <section>
            <SectionHeader title={t("profile.activity")} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label={t("profile.posted")} value={data.bountiesPosted} icon={<LockIcon className="h-5 w-5" />} />
              <StatCard label={t("profile.doneAsPoster")} value={data.bountiesCompletedAsPoster} icon={<CheckIcon className="h-5 w-5" />} />
              <StatCard label={t("profile.claimed")} value={data.bountiesClaimed} icon={<TasksIcon className="h-5 w-5" />} />
              <StatCard label={t("profile.doneAsHunter")} value={data.bountiesCompletedAsHunter} icon={<TrophyIcon className="h-5 w-5" />} />
            </div>
          </section>

          <section>
            <SectionHeader title={t("profile.achievements")} />
            <Achievements rep={data} />
          </section>
        </div>
      )}
    </AppShell>
  );
}
