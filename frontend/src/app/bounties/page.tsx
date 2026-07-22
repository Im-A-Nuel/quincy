"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/nav/AppShell";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { CategoryChips } from "@/components/bounty/CategoryChips";
import { SortChips } from "@/components/bounty/SortChips";
import { SearchBar } from "@/components/bounty/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyBoxArt, ErrorArt } from "@/components/illustrations/spot";
import { useBounties } from "@/hooks/useBounties";
import { useT } from "@/lib/i18n/LanguageContext";
import type { BountyCategory } from "@/lib/types";
import type { SortOption } from "@/lib/constants";

function ExploreContent() {
  const t = useT();
  const params = useSearchParams();
  const initialCategory = (params.get("category") ?? "") as BountyCategory | "";

  const [category, setCategory] = useState<BountyCategory | "">(initialCategory);
  const [sort, setSort] = useState<SortOption>("newest");
  const [q, setQ] = useState(params.get("q") ?? "");

  const { data, isLoading, isError, refetch } = useBounties({
    status: "open",
    category: category || undefined,
    sort,
    q: q || undefined,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t("explore.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("explore.subtitle")}</p>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder={t("explore.searchPlaceholder")} />

      <CategoryChips value={category} onChange={setCategory} />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {data ? `${data.total} ${t("explore.open")}` : " "}
        </span>
        <SortChips value={sort} onChange={setSort} />
      </div>

      {isLoading && <BountyListSkeleton />}

      {isError && (
        <EmptyState
          art={<ErrorArt />}
          title={t("explore.couldNotLoad")}
          hint={t("explore.couldNotLoadHint")}
          action={
            <button className="btn-primary" onClick={() => refetch()}>
              {t("common.retry")}
            </button>
          }
        />
      )}

      {data && data.bounties.length === 0 && (
        <EmptyState
          art={<EmptyBoxArt />}
          title={t("explore.noBounties")}
          hint={t("explore.noBountiesHint")}
          action={
            <Link href="/create" className="btn-primary">
              {t("common.postABounty")}
            </Link>
          }
        />
      )}

      {data && data.bounties.length > 0 && (
        <div className="stagger grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {data.bounties.map((b) => (
            <BountyCard key={b.id} bounty={b} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BountiesPage() {
  return (
    <AppShell maxWidth="max-w-5xl">
      <Suspense fallback={<BountyListSkeleton />}>
        <ExploreContent />
      </Suspense>
    </AppShell>
  );
}
