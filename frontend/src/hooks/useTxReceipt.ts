"use client";

import { useWaitForTransactionReceipt } from "wagmi";

/** Wait for a tx hash to confirm; exposes pending/success flags for the UI. */
export function useTxReceipt(hash?: `0x${string}`) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: Boolean(hash) },
  });
  return { isConfirming: isLoading, isConfirmed: isSuccess, isError };
}
