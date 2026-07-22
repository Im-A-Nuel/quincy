"use client";

import type { Reputation } from "@/lib/types";
import { IconTile } from "@/components/ui/IconTile";
import { StarIcon, CheckIcon, LockIcon } from "@/components/ui/icons";
import { useT } from "@/lib/i18n/LanguageContext";

/** Unlockable badges derived from on-chain reputation counters. */
export function Achievements({ rep }: { rep: Reputation }) {
  const t = useT();
  const badges = [
    {
      unlocked: rep.bountiesPosted >= 1,
      tint: "green" as const,
      Icon: LockIcon,
      label: t("profile.firstPost"),
    },
    {
      unlocked: rep.bountiesCompletedAsHunter >= 1,
      tint: "blue" as const,
      Icon: CheckIcon,
      label: t("profile.firstWin"),
    },
    {
      unlocked: rep.bountiesCompletedAsHunter >= 10,
      tint: "yellow" as const,
      Icon: StarIcon,
      label: t("profile.tenCompleted"),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {badges.map((b) => (
        <div
          key={b.label}
          className={`flex flex-col items-center gap-2 rounded-2xl bg-surface p-3 text-center shadow-soft ${
            b.unlocked ? "" : "opacity-40 grayscale"
          }`}
        >
          <IconTile tint={b.tint} size="sm">
            <b.Icon className="h-5 w-5" />
          </IconTile>
          <span className="text-[11px] font-medium text-gray-600">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
