import { BountyStatus } from "@/lib/types";
import { CheckIcon, LockIcon } from "@/components/ui/icons";

/**
 * Escrow state line, styled like a payment receipt's confirmation row:
 * funds locked while active, released on completion, refunded on cancel.
 */
export function EscrowStatus({ status }: { status: BountyStatus }) {
  const released = status === BountyStatus.Completed;
  const refunded = status === BountyStatus.Cancelled;

  const meta = released
    ? { text: "Reward released to hunter", tone: "text-quincy-700 bg-soft-green", Icon: CheckIcon }
    : refunded
      ? { text: "Reward refunded to poster", tone: "text-gray-600 bg-soft-gray", Icon: CheckIcon }
      : { text: "Reward locked in escrow", tone: "text-quincy-700 bg-soft-green", Icon: LockIcon };

  const { text, tone, Icon } = meta;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${tone}`}>
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}
