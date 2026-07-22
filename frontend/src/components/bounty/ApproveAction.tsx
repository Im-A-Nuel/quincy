"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useApproveBounty, useDisputeBounty } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { fireConfetti } from "@/lib/confetti";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * Shown to the poster while a bounty is in PendingReview: approve to release
 * the reward, or open a dispute if the proof is unsatisfactory.
 */
export function ApproveAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const t = useT();
  const { approveBounty } = useApproveBounty();
  const { disputeBounty } = useDisputeBounty();
  const toast = useToast();
  const [pending, setPending] = useState<"approve" | "dispute" | null>(null);

  async function act(kind: "approve" | "dispute") {
    setPending(kind);
    try {
      if (kind === "approve") {
        await approveBounty(bountyId);
        toast.success(t("bounty.approveSuccess"));
        fireConfetti();
      } else {
        await disputeBounty(bountyId);
        toast.info(t("bounty.disputeOpened"));
      }
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("bounty.transactionFailed"));
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
        {t("bounty.approveAndRelease")}
      </TxButton>
      <button
        onClick={() => act("dispute")}
        disabled={pending !== null}
        className="btn-ghost w-full border border-gray-200 disabled:opacity-50"
      >
        {pending === "dispute" ? t("bounty.openingDispute") : t("bounty.rejectDispute")}
      </button>
    </div>
  );
}
