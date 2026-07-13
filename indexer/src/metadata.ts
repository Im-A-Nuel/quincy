// Mirrors the frontend metadata codec: on-chain bounties pack title, category
// and description as JSON into the single `description` field.

export interface BountyMetadata {
  title: string;
  category: string;
  description: string;
}

const CATEGORIES = [
  "errand",
  "design",
  "research",
  "translation",
  "development",
  "writing",
  "other",
];

export function decodeMetadata(raw: string): BountyMetadata {
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && "title" in obj) {
      const category = String(obj.category ?? "other");
      return {
        title: String(obj.title ?? "Untitled bounty"),
        category: CATEGORIES.includes(category) ? category : "other",
        description: String(obj.description ?? ""),
      };
    }
  } catch {
    /* not JSON - treat as plain description */
  }
  return { title: "Untitled bounty", category: "other", description: raw };
}

/** On-chain Status enum index -> API status string. */
const STATUS = [
  "open",
  "in_progress",
  "pending_review",
  "completed",
  "cancelled",
  "disputed",
];

export function statusFromIndex(index: number): string {
  return STATUS[index] ?? "open";
}
