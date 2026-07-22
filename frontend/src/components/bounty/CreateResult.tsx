"use client";

import { useEffect } from "react";
import Link from "next/link";
import { txUrl } from "@/lib/chains";
import { EmptyState } from "@/components/ui/EmptyState";
import { SuccessArt } from "@/components/illustrations/spot";
import { fireConfetti } from "@/lib/confetti";
import { useT } from "@/lib/i18n/LanguageContext";

/** Success panel shown after a bounty is created on-chain. */
export function CreateResult({ txHash }: { txHash: `0x${string}` }) {
  const t = useT();
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <EmptyState
      art={<SuccessArt />}
      title={t("create.resultTitle")}
      hint={t("create.resultHint")}
      action={
        <div className="flex flex-col items-center gap-2">
          <Link href="/bounties" className="btn-primary">
            {t("create.viewOpenBounties")}
          </Link>
          <a
            href={txUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:underline"
          >
            {t("common.viewTransaction")}
          </a>
        </div>
      }
    />
  );
}
