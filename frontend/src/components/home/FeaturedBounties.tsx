"use client";

import Link from "next/link";
import { useBounties } from "@/hooks/useBounties";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyBoxArt } from "@/components/illustrations/spot";

/** Top open bounties by reward for the home page. */
export function FeaturedBounties() {
  const { data, isLoading } = useBounties({ status: "open", sort: "reward_desc" });
  const featured = data?.bounties.slice(0, 4) ?? [];

  return (
    <section>
      <SectionHeader title="Featured bounties" actionLabel="See all" actionHref="/bounties" />
      {isLoading ? (
        <BountyListSkeleton count={2} />
      ) : featured.length === 0 ? (
        <EmptyState
          art={<EmptyBoxArt />}
          title="No open bounties yet"
          hint="Post the first one and get it in front of hunters."
          action={
            <Link href="/create" className="btn-primary">
              Post a bounty
            </Link>
          }
        />
      ) : (
        <div className="stagger grid gap-3 md:grid-cols-2">
          {featured.map((b) => (
            <BountyCard key={b.id} bounty={b} />
          ))}
        </div>
      )}
    </section>
  );
}
