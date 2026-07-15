import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { IconTile } from "@/components/ui/IconTile";
import { CATEGORY_ICON } from "@/components/ui/categoryIcons";

const TINTS = ["indigo", "blue", "purple", "pink", "orange", "yellow", "mint"] as const;

/** Swipeable row of category shortcuts into the filtered explore page. */
export function CategoryRow() {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 no-scrollbar md:mx-0 md:px-0">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.value}
          href={`/bounties?category=${c.value}`}
          className="group flex w-20 shrink-0 flex-col items-center gap-2"
        >
          <IconTile tint={TINTS[i % TINTS.length]} size="lg" interactive>
            {(() => {
              const Icon = CATEGORY_ICON[c.value];
              return <Icon className="h-7 w-7" />;
            })()}
          </IconTile>
          <span className="text-center text-xs font-medium text-gray-600 transition-colors duration-200 group-hover:text-quincy-600">
            {c.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
