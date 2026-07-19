import Link from "next/link";
import type { BountyListItem } from "@/lib/types";
import { formatToken, timeUntil, isExpired, shortAddress } from "@/lib/format";
import { tokenSymbol } from "@/lib/chains";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Avatar } from "@/components/ui/Avatar";
import { ClockIcon } from "@/components/ui/icons";

export function BountyCard({ bounty }: { bounty: BountyListItem }) {
  const expired = isExpired(bounty.deadline);
  return (
    <Link
      href={`/bounties/${bounty.id}`}
      className="group block rounded-3xl border border-black/[0.04] bg-surface p-5 shadow-soft transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:shadow-float active:scale-[0.98] active:duration-100 active:ease-snappy"
    >
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge category={bounty.category} />
        <StatusBadge status={bounty.status} />
      </div>

      <h3 className="mt-3 font-bold leading-snug text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-quincy-700">
        {bounty.title}
      </h3>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar address={bounty.posterAddress} size="sm" />
          <span className="text-xs text-gray-400">{shortAddress(bounty.posterAddress)}</span>
        </div>
        <span className="rounded-full bg-quincy-50 px-3 py-1 text-sm font-bold text-quincy-700">
          {formatToken(bounty.rewardAmount, tokenSymbol(bounty.rewardToken))}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <ClockIcon className="h-4 w-4" />
        {expired ? "Deadline passed" : `Due ${timeUntil(bounty.deadline)}`}
      </div>
    </Link>
  );
}
