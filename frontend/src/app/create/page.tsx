"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConnectGate } from "@/components/ConnectGate";
import { CreateBountyForm } from "@/components/bounty/CreateBountyForm";
import { CreateResult } from "@/components/bounty/CreateResult";
import { useCreateBountyFlow } from "@/hooks/useCreateBountyFlow";

const STEP_LABEL: Record<string, string> = {
  approving: "Approving cUSD…",
  creating: "Posting bounty…",
};

export default function CreatePage() {
  const { run, step, error, txHash } = useCreateBountyFlow();
  const busy = step === "approving" || step === "creating";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900">Post a bounty</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your cUSD reward is locked in escrow the moment the bounty is posted.
        </p>

        <div className="mt-6">
          {step === "done" && txHash ? (
            <CreateResult txHash={txHash} />
          ) : (
            <ConnectGate message="Connect your wallet to post a bounty.">
              <CreateBountyForm onSubmit={run} submitting={busy} />
              {busy && (
                <p className="mt-3 text-center text-sm text-quincy-700">
                  {STEP_LABEL[step]} confirm in your wallet.
                </p>
              )}
              {error && (
                <p className="mt-3 text-center text-sm text-red-600">{error}</p>
              )}
            </ConnectGate>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
