"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useClaimBounty } from "@/hooks/useBountyActions";

/** Claim button shown to non-poster wallets on an open bounty. */
export function ClaimAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { claimBounty } = useClaimBounty();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setError(null);
    setPending(true);
    try {
      await claimBounty(bountyId);
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <TxButton pending={pending} onClick={handleClaim} className="w-full">
        Claim this bounty
      </TxButton>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
