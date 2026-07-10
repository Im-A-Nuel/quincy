import type { BountyCategory, BountyStatus } from "./types";

/** Minimum reward to avoid dust-value spam bounties not worth gas (REQUIREMENTS.md). */
export const MIN_REWARD_CUSD = 0.5;

/** cUSD has 18 decimals on Celo. */
export const CUSD_DECIMALS = 18;

/** Selectable bounty categories, in display order. */
export const CATEGORIES: { value: BountyCategory; label: string; emoji: string }[] = [
  { value: "errand", label: "Errand", emoji: "🛵" },
  { value: "design", label: "Design", emoji: "🎨" },
  { value: "research", label: "Research", emoji: "🔎" },
  { value: "translation", label: "Translation", emoji: "🌐" },
  { value: "development", label: "Development", emoji: "💻" },
  { value: "writing", label: "Writing", emoji: "✍️" },
  { value: "other", label: "Other", emoji: "📦" },
];

/** Human-friendly labels + tailwind badge classes per status. */
export const STATUS_META: Record<BountyStatus, { label: string; badge: string }> = {
  open: { label: "Open", badge: "bg-quincy-100 text-quincy-800" },
  in_progress: { label: "In Progress", badge: "bg-blue-100 text-blue-800" },
  pending_review: { label: "Pending Review", badge: "bg-amber-100 text-amber-800" },
  completed: { label: "Completed", badge: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-600" },
  disputed: { label: "Disputed", badge: "bg-red-100 text-red-800" },
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "reward_desc", label: "Highest reward" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
