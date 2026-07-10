import type { Bounty, BountyListItem, Reputation } from "./types";
import type { SortOption } from "./constants";
import { MOCK_BOUNTIES, isMockMode, mockReputation } from "./mocks";

// All list/detail reads go through the indexer-backed API, never the chain
// directly (see CLAUDE.md read/write split).

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api/v1";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    let code = "UNKNOWN";
    let message = res.statusText;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, code, message);
  }
  return res.json() as Promise<T>;
}

export interface BountiesQuery {
  status?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
}

export interface BountiesResponse {
  bounties: BountyListItem[];
  page: number;
  total: number;
}

export function fetchBounties(query: BountiesQuery = {}): Promise<BountiesResponse> {
  if (isMockMode()) return Promise.resolve(mockBounties(query));
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  const qs = params.toString();
  return get<BountiesResponse>(`/bounties${qs ? `?${qs}` : ""}`);
}

export function fetchBounty(id: number): Promise<Bounty> {
  if (isMockMode()) {
    const found = MOCK_BOUNTIES.find((b) => b.id === id);
    if (!found) {
      return Promise.reject(new ApiError(404, "NOT_FOUND", `Bounty ${id} not found`));
    }
    return Promise.resolve(found);
  }
  return get<Bounty>(`/bounties/${id}`);
}

/** Filter + sort mock bounties to mimic the read API's behaviour. */
function mockBounties(query: BountiesQuery): BountiesResponse {
  let rows = [...MOCK_BOUNTIES];
  if (query.status) rows = rows.filter((b) => b.status === query.status);
  if (query.category) rows = rows.filter((b) => b.category === query.category);
  if (query.sort === "reward_desc") {
    rows.sort((a, b) => Number(b.rewardAmount) - Number(a.rewardAmount));
  } else {
    rows.sort((a, b) => b.id - a.id);
  }
  return {
    bounties: rows.map(({ id, title, category, rewardAmount, status, posterAddress, deadline }) => ({
      id,
      title,
      category,
      rewardAmount,
      status,
      posterAddress,
      deadline,
    })),
    page: query.page ?? 1,
    total: rows.length,
  };
}

export function fetchProfile(address: string): Promise<Reputation> {
  if (isMockMode()) return Promise.resolve(mockReputation(address));
  return get<Reputation>(`/profiles/${address}`);
}
