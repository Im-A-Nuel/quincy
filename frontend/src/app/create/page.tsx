"use client";

import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { CreateBountyForm } from "@/components/bounty/CreateBountyForm";
import { CreateResult } from "@/components/bounty/CreateResult";
import { useCreateBountyFlow } from "@/hooks/useCreateBountyFlow";
import { LockIcon } from "@/components/ui/icons";

const STEP_LABEL: Record<string, string> = {
  approving: "Approving cUSD…",
  creating: "Posting bounty…",
};

export default function CreatePage() {
  const { run, step, error, txHash } = useCreateBountyFlow();
  const busy = step === "approving" || step === "creating";

  return (
    <AppShell maxWidth="max-w-xl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Post a bounty</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <LockIcon className="h-4 w-4 text-quincy-500" />
          Your cUSD reward is locked in escrow the moment you post.
        </p>
      </div>

      {step === "done" && txHash ? (
        <CreateResult txHash={txHash} />
      ) : (
        <ConnectGate message="Connect your wallet to post a bounty.">
          <div className="card-float">
            <CreateBountyForm onSubmit={run} submitting={busy} />
            {busy && (
              <p className="mt-3 text-center text-sm font-medium text-quincy-700">
                {STEP_LABEL[step]} confirm in your wallet.
              </p>
            )}
            {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          </div>
        </ConnectGate>
      )}
    </AppShell>
  );
}
