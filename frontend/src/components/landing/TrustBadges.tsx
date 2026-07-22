"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/LanguageContext";

const BADGES = [
  { art: "/badge-non-custodial.webp", titleKey: "nonCustodialTitle", bodyKey: "nonCustodialBody" },
  { art: "/badge-cusd-rewards.webp", titleKey: "cusdTitle", bodyKey: "cusdBody" },
  { art: "/badge-onchain-reputation.webp", titleKey: "reputationTitle", bodyKey: "reputationBody" },
] as const;

export function TrustBadges() {
  const t = useT();
  return (
    <section className="py-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {BADGES.map((b, i) => (
          <Reveal key={b.titleKey} delayMs={i * 100}>
            <div className="flex items-start gap-3 rounded-3xl bg-surface p-5 shadow-soft">
              <img src={b.art} alt="" width={56} height={56} className="h-14 w-14 shrink-0" />
              <div>
                <p className="font-bold text-gray-900">{t(`landing.trust.${b.titleKey}`)}</p>
                <p className="mt-0.5 text-sm text-gray-500">{t(`landing.trust.${b.bodyKey}`)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
