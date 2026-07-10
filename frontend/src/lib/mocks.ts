import type { Bounty } from "./types";
import { BountyStatus } from "./types";

// Sample data so the UI is demonstrable before the indexer API is live.
// Enabled when NEXT_PUBLIC_USE_MOCKS=1. Never used in production reads.

const now = Date.now();
const day = 86_400_000;
const iso = (offsetDays: number) => new Date(now + offsetDays * day).toISOString();

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: 1,
    posterAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    hunterAddress: null,
    title: "Translate a one-page flyer EN → Swahili",
    description:
      "Need a clean, natural translation of a single marketing flyer from English to Swahili. Deliver as a text file.",
    category: "translation",
    rewardAmount: "2.50",
    status: BountyStatus.Open,
    proofUri: null,
    deadline: iso(5),
    createdAt: iso(-1),
    updatedAt: iso(-1),
    txHashCreated: "0xabc0000000000000000000000000000000000000000000000000000000000001",
    txHashCompleted: null,
  },
  {
    id: 2,
    posterAddress: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    hunterAddress: "0x9f8e7d6c5b4a3928170615243342516071829304",
    title: "Design a simple logo for a coffee stall",
    description:
      "Small local coffee stall needs a minimalist logo. One concept, PNG + SVG. Brown/cream palette.",
    category: "design",
    rewardAmount: "8.00",
    status: BountyStatus.InProgress,
    proofUri: null,
    deadline: iso(3),
    createdAt: iso(-2),
    updatedAt: iso(-1),
    txHashCreated: "0xabc0000000000000000000000000000000000000000000000000000000000002",
    txHashCompleted: null,
  },
  {
    id: 3,
    posterAddress: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    hunterAddress: "0x8e7d6c5b4a3928170615243342516071829304a5",
    title: "Research 10 suppliers of recycled packaging",
    description:
      "Compile a short spreadsheet of 10 suppliers with contact, MOQ, and price range.",
    category: "research",
    rewardAmount: "5.00",
    status: BountyStatus.PendingReview,
    proofUri: "ipfs://bafybeigdyrexampleexampleexampleexampleexampleexample",
    deadline: iso(1),
    createdAt: iso(-4),
    updatedAt: iso(0),
    txHashCreated: "0xabc0000000000000000000000000000000000000000000000000000000000003",
    txHashCompleted: null,
  },
  {
    id: 4,
    posterAddress: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    hunterAddress: "0x7d6c5b4a3928170615243342516071829304a5b6",
    title: "Pick up and deliver a parcel across town",
    description: "Small parcel pickup from Point A and drop at Point B, same day.",
    category: "errand",
    rewardAmount: "1.50",
    status: BountyStatus.Completed,
    proofUri: "ipfs://bafybeihandoffphotoexampleexampleexampleexampleexample",
    deadline: iso(-1),
    createdAt: iso(-6),
    updatedAt: iso(-2),
    txHashCreated: "0xabc0000000000000000000000000000000000000000000000000000000000004",
    txHashCompleted:
      "0xdef0000000000000000000000000000000000000000000000000000000000004",
  },
];

export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCKS === "1";
}
