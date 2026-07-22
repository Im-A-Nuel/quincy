"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/LanguageContext";

const STEPS = [
  { art: "/step-post-lock.webp", titleKey: "postTitle", bodyKey: "postBody" },
  { art: "/step-claim-work.webp", titleKey: "claimTitle", bodyKey: "claimBody" },
  { art: "/step-submit-proof.webp", titleKey: "proofTitle", bodyKey: "proofBody" },
  { art: "/step-approve-pay.webp", titleKey: "approveTitle", bodyKey: "approveBody" },
] as const;

export function HowItWorks() {
  const t = useT();
  return (
    <section className="py-10">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">{t("landing.steps.title")}</h2>
        <p className="mt-2 text-center text-sm text-gray-500">{t("landing.steps.subtitle")}</p>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.titleKey} delayMs={i * 100}>
            <div className="card text-center">
              <div className="flex justify-center">
                <img src={s.art} alt="" width={96} height={96} className="h-24 w-24" />
              </div>
              <p className="mt-2 text-xs font-bold text-quincy-500">
                {t("landing.steps.step")} {i + 1}
              </p>
              <p className="mt-1 font-bold text-gray-900">{t(`landing.steps.${s.titleKey}`)}</p>
              <p className="mt-1 text-sm text-gray-500">{t(`landing.steps.${s.bodyKey}`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
