"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/api";

/** Fetch on-chain reputation for a wallet address. */
export function useProfile(address: string) {
  return useQuery({
    queryKey: ["profile", address],
    queryFn: () => fetchProfile(address),
    enabled: /^0x[a-fA-F0-9]{40}$/.test(address),
  });
}
