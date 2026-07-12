"use client";

import { useWriteContract } from "wagmi";
import { quincyBountyAbi } from "@/lib/abi/quincyBounty";
import { quincyAddress } from "@/lib/chains";

/**
 * Write hooks for each bounty lifecycle step. Each action is its own on-chain
 * transaction (create, claim, submit, approve, cancel, dispute) — never
 * batched — matching the contract's one-tx-per-step design.
 */
function useBountyWrite() {
  const { writeContractAsync, ...rest } = useWriteContract();
  const call = (functionName: string, args: readonly unknown[]) =>
    writeContractAsync({
      abi: quincyBountyAbi,
      address: quincyAddress,
      functionName: functionName as never,
      args: args as never,
    });
  return { call, ...rest };
}

export function useCreateBounty() {
  const { call, ...rest } = useBountyWrite();
  const createBounty = (description: string, reward: bigint, deadline: bigint) =>
    call("createBounty", [description, reward, deadline]);
  return { createBounty, ...rest };
}

export function useClaimBounty() {
  const { call, ...rest } = useBountyWrite();
  const claimBounty = (bountyId: number) => call("claimBounty", [BigInt(bountyId)]);
  return { claimBounty, ...rest };
}

export function useSubmitProof() {
  const { call, ...rest } = useBountyWrite();
  const submitProof = (bountyId: number, proofURI: string) =>
    call("submitProof", [BigInt(bountyId), proofURI]);
  return { submitProof, ...rest };
}

export function useApproveBounty() {
  const { call, ...rest } = useBountyWrite();
  const approveBounty = (bountyId: number) => call("approveBounty", [BigInt(bountyId)]);
  return { approveBounty, ...rest };
}

export function useCancelBounty() {
  const { call, ...rest } = useBountyWrite();
  const cancelBounty = (bountyId: number) => call("cancelBounty", [BigInt(bountyId)]);
  return { cancelBounty, ...rest };
}

export function useDisputeBounty() {
  const { call, ...rest } = useBountyWrite();
  const disputeBounty = (bountyId: number) => call("disputeBounty", [BigInt(bountyId)]);
  return { disputeBounty, ...rest };
}
