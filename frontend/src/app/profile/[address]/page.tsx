"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/profile/StatCard";
import { SuccessRate } from "@/components/profile/SuccessRate";
import { useProfile } from "@/hooks/useProfile";
import { shortAddress, formatCusd } from "@/lib/format";
import { addressUrl } from "@/lib/chains";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const address = params.address;
  const { data, isLoading, isError } = useProfile(address);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{shortAddress(address)}</h1>
          <a
            href={addressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:underline"
          >
            View on explorer ↗
          </a>
        </div>

        {isLoading && (
          <div className="mt-10 flex justify-center text-quincy-600">
            <Spinner className="h-6 w-6" />
          </div>
        )}

        {isError && (
          <div className="mt-6">
            <EmptyState icon="👤" title="No activity yet" hint="This wallet hasn't posted or claimed any bounties." />
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Posted" value={data.bountiesPosted} />
              <StatCard label="Completed as poster" value={data.bountiesCompletedAsPoster} />
              <StatCard label="Claimed" value={data.bountiesClaimed} />
              <StatCard label="Completed as hunter" value={data.bountiesCompletedAsHunter} />
            </div>

            <SuccessRate
              completed={data.bountiesCompletedAsHunter}
              total={data.bountiesClaimed}
            />

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total earned" value={formatCusd(data.totalEarned)} />
              <StatCard label="Total spent" value={formatCusd(data.totalSpent)} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
