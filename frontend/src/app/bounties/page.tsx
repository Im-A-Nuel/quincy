"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BountyCard } from "@/components/bounty/BountyCard";
import { BountyListSkeleton } from "@/components/bounty/BountyListSkeleton";
import { BountyFilters, type FilterState } from "@/components/bounty/BountyFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBounties } from "@/hooks/useBounties";

export default function BountiesPage() {
  const [filters, setFilters] = useState<FilterState>({ category: "", sort: "newest" });
  const { data, isLoading, isError, refetch } = useBounties({
    status: "open",
    category: filters.category || undefined,
    sort: filters.sort,
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">Open bounties</h1>
          <BountyFilters value={filters} onChange={setFilters} />
        </div>

        {isLoading && <BountyListSkeleton />}

        {isError && (
          <EmptyState
            icon="⚠️"
            title="Couldn't load bounties"
            hint="The indexer may be syncing. Try again in a moment."
            action={
              <button className="btn-primary" onClick={() => refetch()}>
                Retry
              </button>
            }
          />
        )}

        {data && data.bounties.length === 0 && (
          <EmptyState
            title="No open bounties yet"
            hint="Be the first to post one."
            action={
              <Link href="/create" className="btn-primary">
                Post a bounty
              </Link>
            }
          />
        )}

        {data && data.bounties.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.bounties.map((b) => (
              <BountyCard key={b.id} bounty={b} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
