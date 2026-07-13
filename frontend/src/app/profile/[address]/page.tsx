"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { WalletArt } from "@/components/illustrations/spot";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/profile/StatCard";
import { SuccessRate } from "@/components/profile/SuccessRate";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Achievements } from "@/components/profile/Achievements";
import { useProfile } from "@/hooks/useProfile";
import { formatCusd } from "@/lib/format";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const address = params.address;
  const { data, isLoading, isError } = useProfile(address);

  return (
    <AppShell>
      {isLoading && (
        <div className="flex justify-center py-16 text-quincy-600">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {isError && (
        <EmptyState art={<WalletArt />} title="No activity yet" hint="This wallet hasn't posted or claimed any bounties." />
      )}

      {data && (
        <div className="space-y-6">
          <ProfileHeader address={address} completed={data.bountiesCompletedAsHunter} />

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total earned" value={formatCusd(data.totalEarned)} />
            <StatCard label="Total spent" value={formatCusd(data.totalSpent)} />
          </div>

          <SuccessRate
            completed={data.bountiesCompletedAsHunter}
            total={data.bountiesClaimed}
          />

          <section>
            <SectionHeader title="Activity" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Posted" value={data.bountiesPosted} />
              <StatCard label="Done as poster" value={data.bountiesCompletedAsPoster} />
              <StatCard label="Claimed" value={data.bountiesClaimed} />
              <StatCard label="Done as hunter" value={data.bountiesCompletedAsHunter} />
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
