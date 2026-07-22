"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useCancelBounty } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { useT } from "@/lib/i18n/LanguageContext";

/** Cancel button shown to the poster while a bounty is still open. */
export function CancelAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const t = useT();
  const { cancelBounty } = useCancelBounty();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function handleCancel() {
    setPending(true);
    try {
      await cancelBounty(bountyId);
      toast.success(t("bounty.cancelSuccess"));
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("bounty.cancelFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <TxButton
      pending={pending}
      onClick={handleCancel}
      className="w-full !bg-gray-600 hover:!bg-gray-700"
    >
      {t("bounty.cancelAndRefund")}
    </TxButton>
  );
}
