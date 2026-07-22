"use client";

import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { CreateBountyForm } from "@/components/bounty/CreateBountyForm";
import { CreateResult } from "@/components/bounty/CreateResult";
import { useCreateBountyFlow } from "@/hooks/useCreateBountyFlow";
import { LockIcon } from "@/components/ui/icons";
import { useToast } from "@/components/toast/ToastContext";
import { useT } from "@/lib/i18n/LanguageContext";
import { useEffect } from "react";

export default function CreatePage() {
  const t = useT();
  const { run, step, error, txHash } = useCreateBountyFlow();
  const busy = step === "approving" || step === "creating";
  const toast = useToast();

  const STEP_LABEL: Record<string, string> = {
    approving: t("create.approving"),
    creating: t("create.posting"),
  };

  useEffect(() => {
    if (step === "error" && error) toast.error(error);
    if (step === "done") toast.success(t("create.posted"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <AppShell maxWidth="max-w-xl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">{t("create.title")}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <LockIcon className="h-4 w-4 text-quincy-500" />
          {t("create.subtitle")}
        </p>
      </div>

      {step === "done" && txHash ? (
        <CreateResult txHash={txHash} />
      ) : (
        <ConnectGate message={t("create.connectMessage")}>
          <div className="card-float">
            <CreateBountyForm onSubmit={run} submitting={busy} />
            {busy && (
              <p className="mt-3 text-center text-sm font-medium text-quincy-700">
                {STEP_LABEL[step]} {t("create.confirmInWallet")}
              </p>
            )}
            {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          </div>
        </ConnectGate>
      )}
    </AppShell>
  );
}
