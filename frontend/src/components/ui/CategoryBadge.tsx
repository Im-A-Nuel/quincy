import { CATEGORIES } from "@/lib/constants";
import type { BountyCategory } from "@/lib/types";
import { CATEGORY_ICON } from "./categoryIcons";

export function CategoryBadge({ category }: { category: BountyCategory }) {
  const meta = CATEGORIES.find((c) => c.value === category);
  if (!meta) return null;
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
      <Icon className="h-4 w-4 text-quincy-500" />
      {meta.label}
    </span>
  );
}
