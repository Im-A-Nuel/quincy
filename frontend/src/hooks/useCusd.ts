"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi } from "@/lib/abi/erc20";
import { cusdAddress, quincyAddress } from "@/lib/chains";
import { maxUint256 } from "viem";

/** Read the connected wallet's cUSD balance (base units). */
export function useCusdBalance() {
  const { address } = useAccount();
  return useReadContract({
    abi: erc20Abi,
    address: cusdAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });
}

/** Read how much cUSD the wallet has approved the bounty contract to pull. */
export function useCusdAllowance() {
  const { address } = useAccount();
  return useReadContract({
    abi: erc20Abi,
    address: cusdAddress,
    functionName: "allowance",
    args: address ? [address, quincyAddress] : undefined,
    query: { enabled: Boolean(address) },
  });
}

/**
 * Approve the bounty contract to spend cUSD. Pass an exact amount, or omit to
 * grant an unlimited allowance (fewer future approve transactions).
 */
export function useApproveCusd() {
  const { writeContractAsync, ...rest } = useWriteContract();

  const approve = (amount?: bigint) =>
    writeContractAsync({
      abi: erc20Abi,
      address: cusdAddress,
      functionName: "approve",
      args: [quincyAddress, amount ?? maxUint256],
    });

  return { approve, ...rest };
}
