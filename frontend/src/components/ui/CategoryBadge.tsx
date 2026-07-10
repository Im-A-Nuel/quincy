import { CATEGORIES } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";

export function CategoryBadge({ category }: { category: BountyCategory }) {
  const meta = CATEGORIES.find((c) => c.value === category);
  if (!meta) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
