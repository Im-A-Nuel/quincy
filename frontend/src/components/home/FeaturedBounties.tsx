"use client";

import Link from "next/link";
import { useBounties } from "@/hooks/useBounties";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyBoxArt } from "@/components/illustrations/spot";
import { useT } from "@/lib/i18n/LanguageContext";

/** Top open bounties by reward for the home page. */
export function FeaturedBounties() {
  const t = useT();
  const { data, isLoading } = useBounties({ status: "open", sort: "reward_desc" });
  const featured = data?.bounties.slice(0, 4) ?? [];

  return (
    <section>
      <SectionHeader title={t("dashboard.featuredBounties")} actionLabel={t("dashboard.seeAll")} actionHref="/bounties" />
      {isLoading ? (
        <BountyListSkeleton count={2} />
      ) : featured.length === 0 ? (
        <EmptyState
          art={<EmptyBoxArt />}
          title={t("dashboard.noOpenBounties")}
          hint={t("dashboard.noOpenBountiesHint")}
          action={
            <Link href="/create" className="btn-primary">
              {t("common.postABounty")}
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
