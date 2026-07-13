"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/nav/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { BountyDetailSkeleton } from "@/components/bounty/BountyDetailSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchArt } from "@/components/illustrations/spot";
import { InfoRow } from "@/components/ui/InfoRow";
import { Avatar } from "@/components/ui/Avatar";
import { ProofLink } from "@/components/bounty/ProofLink";
import { EscrowStatus } from "@/components/bounty/EscrowStatus";
import { BountyActions } from "@/components/bounty/BountyActions";
import { ShareButton } from "@/components/bounty/ShareButton";
import { BountyStatus } from "@/lib/types";
import { useBounty } from "@/hooks/useBounty";
import { formatCusd, timeUntil, isExpired, shortAddress } from "@/lib/format";
import { txUrl } from "@/lib/chains";

export default function BountyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: bounty, isLoading, isError, refetch } = useBounty(id);

  return (
    <AppShell>
      <Link href="/bounties" className="text-sm font-semibold text-quincy-600 hover:text-quincy-700">
        ← Back
      </Link>

      {isLoading && <BountyDetailSkeleton />}

      {isError && (
        <div className="mt-6">
          <EmptyState art={<SearchArt />} title="Bounty not found" hint="It may have been removed or never existed." />
        </div>
      )}

      {bounty && (
        <div className="mt-3 space-y-4">
          {/* Receipt-style summary card */}
          <div className="card-float text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <CategoryBadge category={bounty.category} />
              <StatusBadge status={bounty.status} />
            </div>

            <p className="text-sm text-gray-400">Reward</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-gray-900">
              {formatCusd(bounty.rewardAmount)}
            </p>

            <div className="mt-4 flex justify-center">
              <EscrowStatus status={bounty.status} />
            </div>

            <div className="mt-5 text-left">
              <InfoRow label="Poster">
                <Link href={`/profile/${bounty.posterAddress}`} className="flex items-center gap-2 text-quincy-700">
                  <Avatar address={bounty.posterAddress} size="sm" />
                  {shortAddress(bounty.posterAddress)}
                </Link>
              </InfoRow>
              {bounty.hunterAddress && (
                <InfoRow label="Hunter">
                  <Link href={`/profile/${bounty.hunterAddress}`} className="flex items-center gap-2 text-quincy-700">
                    <Avatar address={bounty.hunterAddress} size="sm" />
                    {shortAddress(bounty.hunterAddress)}
                  </Link>
                </InfoRow>
              )}
              <InfoRow label="Deadline">
                {isExpired(bounty.deadline) ? "Passed" : timeUntil(bounty.deadline)}
              </InfoRow>
              <InfoRow label="Proof" divider={false}>
                {bounty.proofUri ? (
                  <ProofLink proofUri={bounty.proofUri} />
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </InfoRow>
            </div>
          </div>

          {/* Task brief */}
          <div className="card">
            <h2 className="text-base font-bold text-gray-900">{bounty.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {bounty.description}
            </p>
          </div>

          {/* Action */}
          <BountyActions bounty={bounty} onDone={() => refetch()} />

          {/* Share once completed */}
          {bounty.status === BountyStatus.Completed && <ShareButton bounty={bounty} />}

          {/* On-chain trail */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href={txUrl(bounty.txHashCreated)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">
              Creation tx ↗
            </a>
            {bounty.txHashCompleted && (
              <a href={txUrl(bounty.txHashCompleted)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">
                Completion tx ↗
              </a>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
