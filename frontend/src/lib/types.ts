// Domain models for Quincy. These mirror the on-chain QuincyBounty contract
// and the indexer's Postgres rows (see docs/SCHEMA.md).

/** Bounty lifecycle status. Mirrors the on-chain `Status` enum ordering. */
export enum BountyStatus {
  Open = "open",
  InProgress = "in_progress",
  PendingReview = "pending_review",
  Completed = "completed",
  Cancelled = "cancelled",
  Disputed = "disputed",
}

/** On-chain enum index → string status. Order matches Solidity enum. */
export const STATUS_BY_INDEX: BountyStatus[] = [
  BountyStatus.Open,
  BountyStatus.InProgress,
  BountyStatus.PendingReview,
  BountyStatus.Completed,
  BountyStatus.Cancelled,
  BountyStatus.Disputed,
];

export type BountyCategory =
  | "errand"
  | "design"
  | "research"
  | "translation"
  | "development"
  | "writing"
  | "other";

/** Full bounty row as returned by the read API. */
export interface Bounty {
  id: number;
  posterAddress: `0x${string}`;
  hunterAddress: `0x${string}` | null;
  title: string;
  description: string;
  category: BountyCategory;
  rewardAmount: string; // cUSD, decimal string
  status: BountyStatus;
  proofUri: string | null;
  deadline: string; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  txHashCreated: `0x${string}`;
  txHashCompleted: `0x${string}` | null;
}

/** Compact bounty shape used in list views. */
export type BountyListItem = Pick<
  Bounty,
  "id" | "title" | "category" | "rewardAmount" | "status" | "posterAddress" | "deadline"
>;

/** On-chain reputation counters for a wallet. */
export interface Reputation {
  walletAddress: `0x${string}`;
  bountiesPosted: number;
  bountiesCompletedAsPoster: number;
  bountiesClaimed: number;
  bountiesCompletedAsHunter: number;
  totalEarned: string; // cUSD decimal string
  totalSpent: string; // cUSD decimal string
}
