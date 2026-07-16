"use client";

import { useEffect } from "react";
import Link from "next/link";
import { txUrl } from "@/lib/chains";
import { EmptyState } from "@/components/ui/EmptyState";
import { SuccessArt } from "@/components/illustrations/spot";
import { fireConfetti } from "@/lib/confetti";

/** Success panel shown after a bounty is created on-chain. */
export function CreateResult({ txHash }: { txHash: `0x${string}` }) {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <EmptyState
      art={<SuccessArt />}
      title="Bounty posted!"
      hint="Your reward is now locked in escrow. Hunters can claim it right away."
      action={
        <div className="flex flex-col items-center gap-2">
          <Link href="/bounties" className="btn-primary">
            View open bounties
          </Link>
          <a
            href={txUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:underline"
          >
            View transaction ↗
          </a>
        </div>
      }
    />
  );
}
