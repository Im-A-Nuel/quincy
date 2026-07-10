"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBounties, type BountiesQuery } from "@/lib/api";

/** React-query wrapper for the bounty list, keyed by filter/sort/page. */
export function useBounties(query: BountiesQuery = {}) {
  return useQuery({
    queryKey: ["bounties", query],
    queryFn: () => fetchBounties(query),
  });
}
