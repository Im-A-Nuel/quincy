"use client";

import type { BountyCategory } from "@/lib/types";
import { CATEGORY_ICON } from "./categoryIcons";
import { useT } from "@/lib/i18n/LanguageContext";

export function CategoryBadge({ category }: { category: BountyCategory }) {
  const t = useT();
  const Icon = CATEGORY_ICON[category];
  if (!Icon) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
      <Icon className="h-4 w-4 text-quincy-500" />
      {t(`category.${category}`)}
    </span>
  );
}
