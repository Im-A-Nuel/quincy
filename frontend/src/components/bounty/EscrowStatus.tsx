"use client";

import { BountyStatus } from "@/lib/types";
import { CheckIcon, LockIcon } from "@/components/ui/icons";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * Escrow state line, styled like a payment receipt's confirmation row:
 * funds locked while active, released on completion, refunded on cancel.
 */
export function EscrowStatus({ status }: { status: BountyStatus }) {
  const t = useT();
  const released = status === BountyStatus.Completed;
  const refunded = status === BountyStatus.Cancelled;
  const disputed = status === BountyStatus.Disputed;

  const meta = released
    ? { text: t("bounty.rewardReleased"), tone: "text-quincy-700 bg-soft-green", Icon: CheckIcon }
    : refunded
      ? { text: t("bounty.rewardRefunded"), tone: "text-gray-600 bg-soft-gray", Icon: CheckIcon }
      : disputed
        ? { text: t("bounty.disputedEscrow"), tone: "text-amber-700 bg-amber-50", Icon: LockIcon }
        : { text: t("bounty.lockedInEscrow"), tone: "text-quincy-700 bg-soft-green", Icon: LockIcon };

  const { text, tone, Icon } = meta;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${tone}`}>
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}
