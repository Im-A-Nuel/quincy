"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useCancelBounty } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";

/** Cancel button shown to the poster while a bounty is still open. */
export function CancelAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { cancelBounty } = useCancelBounty();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function handleCancel() {
    setPending(true);
    try {
      await cancelBounty(bountyId);
      toast.success("Bounty cancelled - reward refunded");
      onDone?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cancel failed");
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
      Cancel & refund
    </TxButton>
  );
}
