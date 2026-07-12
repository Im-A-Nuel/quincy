import type { BountyCategory } from "./types";

/**
 * On-chain bounties store a single `description` string. Since there is no
 * off-chain write path, we encode the human metadata (title, category, body)
 * as JSON into that string; the indexer parses it back out into columns.
 */
export interface BountyMetadata {
  title: string;
  category: BountyCategory;
  description: string;
}

const VERSION = 1;

/** Serialize metadata for the on-chain `description` field. */
export function encodeMetadata(meta: BountyMetadata): string {
  return JSON.stringify({ v: VERSION, ...meta });
}

/** Parse an on-chain description string back into metadata. Tolerant of
 *  plain-text (pre-JSON) descriptions. */
export function decodeMetadata(raw: string): BountyMetadata {
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object" && "title" in obj) {
      return {
        title: String(obj.title ?? ""),
        category: (obj.category ?? "other") as BountyCategory,
        description: String(obj.description ?? ""),
      };
    }
  } catch {
    /* not JSON — treat as plain description */
  }
  return { title: "Untitled bounty", category: "other", description: raw };
}
