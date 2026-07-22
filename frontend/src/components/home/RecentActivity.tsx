"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconTile } from "@/components/ui/IconTile";
import { LockIcon, CheckIcon, StarIcon } from "@/components/ui/icons";
import { useT } from "@/lib/i18n/LanguageContext";

// Illustrative recent-activity feed. Replaced by real indexer events later.
const ITEMS = [
  { icon: LockIcon, tint: "green" as const, textKey: "newBountyPosted", meta: "Design a coffee stall logo · 8 CELO" },
  { icon: CheckIcon, tint: "blue" as const, textKey: "bountyCompleted", meta: "Parcel delivery · 1.5 cUSD released" },
  { icon: StarIcon, tint: "yellow" as const, textKey: "reputationEarned", meta: "A hunter reached 11 completed tasks" },
] as const;

/** Lightweight recent-activity feed for the home page. */
export function RecentActivity() {
  const t = useT();
  return (
    <section>
      <SectionHeader title={t("dashboard.recentActivity")} />
      <div className="space-y-2">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
              <IconTile tint={item.tint} size="sm">
                <Icon className="h-5 w-5" />
              </IconTile>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{t(`dashboard.activityFeed.${item.textKey}`)}</p>
                <p className="truncate text-xs text-gray-400">{item.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
