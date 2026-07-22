"use client";

import { Avatar } from "@/components/ui/Avatar";
import { shortAddress } from "@/lib/format";
import { addressUrl } from "@/lib/chains";
import { CopyButton } from "@/components/ui/CopyButton";
import { useT } from "@/lib/i18n/LanguageContext";

/** Gradient profile header card with avatar and wallet identity. */
export function ProfileHeader({
  address,
  completed,
}: {
  address: string;
  completed: number;
}) {
  const t = useT();
  return (
    <section className="animate-scale-in overflow-hidden rounded-4xl bg-gradient-primary p-6 text-center text-white shadow-float">
      <div className="flex justify-center">
        <Avatar address={address} size="lg" />
      </div>
      <CopyButton
        text={address}
        label={t("common.addressCopied")}
        className="mt-3 justify-center text-lg font-bold text-white hover:text-white/80"
      >
        {shortAddress(address)}
      </CopyButton>
      <p className="text-sm text-white/70">
        {completed} {t("profile.bountiesCompleted")}
      </p>
      <a
        href={addressUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25"
      >
        {t("common.viewOnExplorer")}
      </a>
    </section>
  );
}
