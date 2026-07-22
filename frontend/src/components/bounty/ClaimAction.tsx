"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useClaimBounty } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { useT } from "@/lib/i18n/LanguageContext";

/** Claim button shown to non-poster wallets on an open bounty. */
export function ClaimAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const t = useT();
  const { claimBounty } = useClaimBounty();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function handleClaim() {
    setPending(true);
    try {
      await claimBounty(bountyId);
      toast.success(t("bounty.claimSuccess"));
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("bounty.claimFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <TxButton pending={pending} onClick={handleClaim} className="w-full">
      {t("bounty.claimThisBounty")}
    </TxButton>
  );
}
