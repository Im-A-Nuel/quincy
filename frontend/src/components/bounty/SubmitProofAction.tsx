"use client";

import { useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { Field, inputClass } from "@/components/ui/Field";
import { useSubmitProof } from "@/hooks/useBountyActions";

/**
 * Shown to the hunter while a bounty is InProgress. Accepts a proof link or
 * IPFS URI and submits it on-chain. (Direct IPFS upload lands in a follow-up;
 * for now the hunter pastes a link/CID.)
 */
export function SubmitProofAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { submitProof } = useSubmitProof();
  const [uri, setUri] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uri.trim()) {
      setError("Add a proof link or CID");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await submitProof(bountyId, uri.trim());
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Field label="Proof of completion" htmlFor="proof" error={error ?? undefined}>
        <input
          id="proof"
          className={inputClass}
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="https://… or ipfs://CID"
        />
      </Field>
      <TxButton pending={pending} type="submit" className="w-full">
        Submit proof
      </TxButton>
    </form>
  );
}
