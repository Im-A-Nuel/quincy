import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconTile } from "@/components/ui/IconTile";
import { LockIcon, CheckIcon, StarIcon } from "@/components/ui/icons";

// Illustrative recent-activity feed. Replaced by real indexer events later.
const ITEMS = [
  { icon: LockIcon, tint: "green" as const, text: "New bounty posted", meta: "Design a coffee stall logo · 8 cUSD" },
  { icon: CheckIcon, tint: "blue" as const, text: "Bounty completed", meta: "Parcel delivery · 1.5 cUSD released" },
  { icon: StarIcon, tint: "yellow" as const, text: "Reputation earned", meta: "A hunter reached 11 completed tasks" },
];

/** Lightweight recent-activity feed for the home page. */
export function RecentActivity() {
  return (
    <section>
      <SectionHeader title="Recent activity" />
      <div className="space-y-2">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
              <IconTile tint={item.tint} size="sm">
                <Icon className="h-5 w-5" />
              </IconTile>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.text}</p>
                <p className="truncate text-xs text-gray-400">{item.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
