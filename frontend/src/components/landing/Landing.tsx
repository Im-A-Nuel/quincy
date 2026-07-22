"use client";

import Link from "next/link";
import { LandingHero } from "./LandingHero";
import { TrustBadges } from "./TrustBadges";
import { HowItWorks } from "./HowItWorks";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/LanguageContext";

/** Marketing view shown at "/" for visitors who haven't connected a wallet. */
export function Landing() {
  const t = useT();
  return (
    <div>
      <LandingHero />
      <TrustBadges />
      <HowItWorks />

      <section className="py-8">
        <Reveal y={36}>
          <div className="rounded-4xl bg-gradient-primary px-6 py-10 text-center text-white shadow-float">
            <h2 className="text-2xl font-extrabold">{t("landing.ctaTitle")}</h2>
            <p className="mx-auto mt-2 max-w-md text-white/80">{t("landing.ctaSubtitle")}</p>
            <Link href="/create" className="btn mt-6 bg-white text-quincy-700 hover:bg-quincy-50">
              {t("common.postABounty")}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
