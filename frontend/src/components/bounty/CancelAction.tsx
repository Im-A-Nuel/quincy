"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { useCancelBounty } from "@/hooks/useBountyActions";

/** Cancel button shown to the poster while a bounty is still open. */
export function CancelAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { cancelBounty } = useCancelBounty();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    setError(null);
    setPending(true);
    try {
      await cancelBounty(bountyId);
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <TxButton
        pending={pending}
        onClick={handleCancel}
        className="w-full !bg-gray-600 hover:!bg-gray-700"
      >
        Cancel & refund
      </TxButton>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
