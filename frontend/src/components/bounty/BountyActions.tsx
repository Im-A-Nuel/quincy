"use client";

import { useAccount } from "wagmi";
import type { Bounty } from "@/lib/types";
import { BountyStatus } from "@/lib/types";
import { ClaimAction } from "./ClaimAction";
import { CancelAction } from "./CancelAction";
import { SubmitProofAction } from "./SubmitProofAction";
import { ApproveAction } from "./ApproveAction";
import { WalletButton } from "@/components/WalletButton";

const sameAddr = (a?: string | null, b?: string | null) =>
  Boolean(a && b && a.toLowerCase() === b.toLowerCase());

/**
 * Renders the one contextual action available to the connected wallet for this
 * bounty, based on status and whether the viewer is the poster or hunter.
 * `onDone` lets the parent refetch after a successful tx.
 */
export function BountyActions({ bounty, onDone }: { bounty: Bounty; onDone?: () => void }) {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="card flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-gray-500">Connect your wallet to act on this bounty.</p>
        <WalletButton />
      </div>
    );
  }

  const isPoster = sameAddr(address, bounty.posterAddress);
  const isHunter = sameAddr(address, bounty.hunterAddress);

  switch (bounty.status) {
    case BountyStatus.Open:
      return isPoster ? (
        <CancelAction bountyId={bounty.id} onDone={onDone} />
      ) : (
        <ClaimAction bountyId={bounty.id} onDone={onDone} />
      );

    case BountyStatus.InProgress:
      return isHunter ? (
        <SubmitProofAction bountyId={bounty.id} onDone={onDone} />
      ) : (
        <p className="text-center text-sm text-gray-400">
          This bounty is being worked on.
        </p>
      );

    case BountyStatus.PendingReview:
      return isPoster ? (
        <ApproveAction bountyId={bounty.id} onDone={onDone} />
      ) : (
        <p className="text-center text-sm text-gray-400">
          Waiting for the poster to review the proof.
        </p>
      );

    default:
      return null;
  }
}
