"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useApproveCusd, useCusdAllowance } from "./useCusd";
import { useCreateBounty } from "./useBountyActions";
import { encodeMetadata } from "@/lib/metadata";
import { toCusdUnits, toUnixSeconds } from "@/lib/units";
import type { BountyFormValues } from "@/lib/validateBounty";
import type { BountyCategory } from "@/lib/types";

export type CreateStep = "idle" | "approving" | "creating" | "done" | "error";

/**
 * Orchestrates the two-transaction create flow: approve cUSD allowance if it's
 * short, then createBounty. Kept as separate on-chain txs by design.
 */
export function useCreateBountyFlow() {
  const { isConnected } = useAccount();
  const { data: allowance } = useCusdAllowance();
  const { approve } = useApproveCusd();
  const { createBounty } = useCreateBounty();

  const [step, setStep] = useState<CreateStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  async function run(values: BountyFormValues) {
    setError(null);
    if (!isConnected) {
      setError("Connect your wallet first");
      setStep("error");
      return;
    }

    const reward = toCusdUnits(values.reward);
    const deadline = toUnixSeconds(values.deadline);
    const description = encodeMetadata({
      title: values.title.trim(),
      category: values.category as BountyCategory,
      description: values.description.trim(),
    });

    try {
      if ((allowance ?? 0n) < reward) {
        setStep("approving");
        await approve(); // unlimited allowance to avoid re-approving later
      }
      setStep("creating");
      const hash = await createBounty(description, reward, deadline);
      setTxHash(hash);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
      setStep("error");
    }
  }

  return { run, step, error, txHash, isConnected };
}
