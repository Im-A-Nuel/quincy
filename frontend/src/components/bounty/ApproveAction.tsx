"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useApproveBounty, useDisputeBounty } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { fireConfetti } from "@/lib/confetti";

/**
 * Shown to the poster while a bounty is in PendingReview: approve to release
 * the reward, or open a dispute if the proof is unsatisfactory.
 */
export function ApproveAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { approveBounty } = useApproveBounty();
  const { disputeBounty } = useDisputeBounty();
  const toast = useToast();
  const [pending, setPending] = useState<"approve" | "dispute" | null>(null);

  async function act(kind: "approve" | "dispute") {
    setPending(kind);
    try {
      if (kind === "approve") {
        await approveBounty(bountyId);
        toast.success("Approved - reward released to hunter");
        fireConfetti();
      } else {
        await disputeBounty(bountyId);
        toast.info("Dispute opened - an admin will review");
      }
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Transaction failed");
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
    </div>
  );
}
