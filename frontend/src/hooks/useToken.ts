"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { erc20Abi } from "@/lib/abi/erc20";
import { quincyAddress, activeChain } from "@/lib/chains";
import { maxUint256 } from "viem";

/** Read the connected wallet's balance of an arbitrary ERC-20 token. */
export function useTokenBalance(token?: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && token) },
  });
}

/** Read how much of `token` the wallet has approved the bounty contract to pull. */
export function useTokenAllowance(token?: `0x${string}`) {
  const { address } = useAccount();
  return useReadContract({
    abi: erc20Abi,
    address: token,
    functionName: "allowance",
    args: address ? [address, quincyAddress] : undefined,
    query: { enabled: Boolean(address && token) },
  });
}

/**
 * Approve the bounty contract to spend `token`. Pass an exact amount, or omit
 * to grant an unlimited allowance (fewer future approve transactions).
 */
export function useApproveToken() {
  const { writeContractAsync, ...rest } = useWriteContract();

  const approve = (token: `0x${string}`, amount?: bigint) =>
    writeContractAsync({
      abi: erc20Abi,
      address: token,
      functionName: "approve",
      args: [quincyAddress, amount ?? maxUint256],
      // Forces the wallet onto Celo instead of sending on whatever network
      // it's already active on - see useBountyActions.ts for the same fix.
      chainId: activeChain.id,
    });

  return { approve, ...rest };
}
