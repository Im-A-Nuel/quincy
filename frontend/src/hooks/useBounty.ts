"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBounty } from "@/lib/api";

/** Fetch a single bounty by id. Disabled for non-positive ids. */
export function useBounty(id: number) {
  return useQuery({
    queryKey: ["bounty", id],
    queryFn: () => fetchBounty(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
