"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreateBountyForm } from "@/components/bounty/CreateBountyForm";
import type { BountyFormValues } from "@/lib/validateBounty";

export default function CreatePage() {
  // Wiring to the approve + createBounty transactions lands in a follow-up.
  const handleSubmit = (values: BountyFormValues) => {
    // eslint-disable-next-line no-console
    console.log("create bounty (not yet wired):", values);
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900">Post a bounty</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your cUSD reward is locked in escrow the moment the bounty is posted.
        </p>
        <div className="mt-6">
          <CreateBountyForm onSubmit={handleSubmit} />
        </div>
      </main>
      <Footer />
    </>
  );
}
