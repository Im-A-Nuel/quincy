import Link from "next/link";
import type { BountyListItem } from "@/lib/types";
import { formatCusd, timeUntil, isExpired } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";

export function BountyCard({ bounty }: { bounty: BountyListItem }) {
  const expired = isExpired(bounty.deadline);
  return (
    <Link href={`/bounties/${bounty.id}`} className="card block transition hover:border-quincy-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{bounty.title}</h3>
        <StatusBadge status={bounty.status} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <CategoryBadge category={bounty.category} />
        <span className="text-sm font-bold text-quincy-700">
          {formatCusd(bounty.rewardAmount)}
        </span>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {expired ? "Deadline passed" : `Due ${timeUntil(bounty.deadline)}`}
      </p>
    </Link>
  );
}
