"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useApproveBounty, useDisputeBounty } from "@/hooks/useBountyActions";

/**
 * Shown to the poster while a bounty is in PendingReview: approve to release
 * the reward, or open a dispute if the proof is unsatisfactory.
 */
export function ApproveAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { approveBounty } = useApproveBounty();
  const { disputeBounty } = useDisputeBounty();
  const [pending, setPending] = useState<"approve" | "dispute" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(kind: "approve" | "dispute") {
    setError(null);
    setPending(kind);
    try {
      if (kind === "approve") await approveBounty(bountyId);
      else await disputeBounty(bountyId);
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-2">
      <TxButton
        pending={pending === "approve"}
        disabled={pending !== null}
        onClick={() => act("approve")}
        className="w-full"
      >
        Approve & release reward
      </TxButton>
      <button
        onClick={() => act("dispute")}
        disabled={pending !== null}
        className="btn-ghost w-full border border-gray-200 disabled:opacity-50"
      >
        {pending === "dispute" ? "Opening dispute…" : "Reject / dispute"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
