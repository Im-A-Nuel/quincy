"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useTokenAllowance, useApproveToken } from "./useToken";
import { useCreateBounty } from "./useBountyActions";
import { encodeMetadata } from "@/lib/metadata";
import { toTokenUnits, toUnixSeconds } from "@/lib/units";
import { cusdAddress, celoTokenAddress } from "@/lib/chains";
import type { BountyFormValues } from "@/lib/validateBounty";
import type { BountyCategory } from "@/lib/types";

export type CreateStep = "idle" | "approving" | "creating" | "done" | "error";

function resolveTokenAddress(token: BountyFormValues["token"]): `0x${string}` {
  return token === "celo" ? celoTokenAddress : cusdAddress;
}

/**
 * Orchestrates the two-transaction create flow: approve the chosen reward
 * token's allowance if it's short, then createBounty. Kept as separate
 * on-chain txs by design.
 */
export function useCreateBountyFlow() {
  const { isConnected } = useAccount();

  // Hooks can't be called conditionally per-token, so allowance is read for
  // both tokens up front and the right one is picked at submit time.
  const { data: cusdAllowance } = useTokenAllowance(cusdAddress);
  const { data: celoAllowance } = useTokenAllowance(celoTokenAddress);
  const { approve } = useApproveToken();
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

    const token = resolveTokenAddress(values.token);
    const reward = toTokenUnits(values.reward);
    const deadline = toUnixSeconds(values.deadline);
    const description = encodeMetadata({
      title: values.title.trim(),
      category: values.category as BountyCategory,
      description: values.description.trim(),
    });
    const allowance = token === celoTokenAddress ? celoAllowance : cusdAllowance;

    try {
      if ((allowance ?? 0n) < reward) {
        setStep("approving");
        await approve(token); // unlimited allowance to avoid re-approving later
      }
      setStep("creating");
      const hash = await createBounty(token, description, reward, deadline);
      setTxHash(hash);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
      setStep("error");
    }
  }

  return { run, step, error, txHash, isConnected };
}
