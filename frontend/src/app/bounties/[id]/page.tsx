"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProofLink } from "@/components/bounty/ProofLink";
import { AddressChip } from "@/components/bounty/AddressChip";
import { BountyActions } from "@/components/bounty/BountyActions";
import { useBounty } from "@/hooks/useBounty";
import { formatCusd, timeUntil, isExpired } from "@/lib/format";
import { txUrl } from "@/lib/chains";

export default function BountyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: bounty, isLoading, isError, refetch } = useBounty(id);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Link href="/bounties" className="text-sm text-quincy-700 hover:underline">
          ← Back to bounties
        </Link>

        {isLoading && (
          <div className="mt-10 flex justify-center text-quincy-600">
            <Spinner className="h-6 w-6" />
          </div>
        )}

        {isError && (
          <div className="mt-6">
            <EmptyState icon="🔍" title="Bounty not found" hint="It may have been removed or never existed." />
          </div>
        )}

        {bounty && (
          <article className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{bounty.title}</h1>
              <StatusBadge status={bounty.status} />
            </div>

            <div className="mt-2 flex items-center gap-3">
              <CategoryBadge category={bounty.category} />
              <span className="text-lg font-bold text-quincy-700">
                {formatCusd(bounty.rewardAmount)}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-gray-700">{bounty.description}</p>

            <div className="card mt-6 space-y-2">
              <AddressChip address={bounty.posterAddress} label="Poster" />
              <AddressChip address={bounty.hunterAddress} label="Hunter" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Deadline</span>
                <span className="font-medium">
                  {isExpired(bounty.deadline) ? "Passed" : timeUntil(bounty.deadline)}
                </span>
              </div>
              <div className="pt-1">
                <ProofLink proofUri={bounty.proofUri} />
              </div>
            </div>

            <div className="mt-6">
              <BountyActions bounty={bounty} onDone={() => refetch()} />
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <a href={txUrl(bounty.txHashCreated)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">
                Creation tx ↗
              </a>
              {bounty.txHashCompleted && (
                <a href={txUrl(bounty.txHashCompleted)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">
                  Completion tx ↗
                </a>
              )}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
