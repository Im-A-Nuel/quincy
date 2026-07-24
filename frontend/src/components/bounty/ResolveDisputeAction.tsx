"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useResolveDispute } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { fireConfetti } from "@/lib/confetti";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * Admin-only: shown on a Disputed bounty to the wallet matching the
 * contract's admin() address. Resolves the dispute by either releasing the
 * reward to the hunter or refunding the poster - see resolveDispute in
 * QuincyBounty.sol.
 */
export function ResolveDisputeAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const t = useT();
  const { resolveDispute } = useResolveDispute();
  const toast = useToast();
  const [pending, setPending] = useState<"pay" | "refund" | null>(null);

  async function act(payHunter: boolean) {
    setPending(payHunter ? "pay" : "refund");
    try {
      await resolveDispute(bountyId, payHunter);
      toast.success(payHunter ? t("bounty.resolvePaidSuccess") : t("bounty.resolveRefundedSuccess"));
      if (payHunter) fireConfetti();
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("bounty.resolveFailed"));
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="card space-y-3">
      <p className="text-center text-xs font-medium text-amber-600">{t("bounty.adminReviewingDispute")}</p>
      <div className="space-y-2">
        <TxButton
          pending={pending === "pay"}
          disabled={pending !== null}
          onClick={() => act(true)}
          className="w-full"
        >
          {t("bounty.payHunter")}
        </TxButton>
        <TxButton
          pending={pending === "refund"}
          disabled={pending !== null}
          onClick={() => act(false)}
          className="w-full !bg-gray-600 hover:!bg-gray-700"
        >
          {t("bounty.refundPoster")}
        </TxButton>
      </div>
    </div>
  );
}
