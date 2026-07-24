"use client";

import { useAccount, useReadContract } from "wagmi";
import { quincyBountyAbi } from "@/lib/abi/quincyBounty";
import { quincyAddress } from "@/lib/chains";

/** Reads the contract's configured admin address and whether the connected
 *  wallet matches it - the only wallet allowed to call resolveDispute. */
export function useAdmin() {
  const { address } = useAccount();
  const { data: admin, ...rest } = useReadContract({
    abi: quincyBountyAbi,
    address: quincyAddress,
    functionName: "admin",
  });

  const isAdmin = Boolean(address && admin && address.toLowerCase() === admin.toLowerCase());

  return { admin, isAdmin, ...rest };
}
