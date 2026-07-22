"use client";

import { WalletSummary } from "@/components/home/WalletSummary";
import { CategoryRow } from "@/components/home/CategoryRow";
import { FeaturedBounties } from "@/components/home/FeaturedBounties";
import { RecentActivity } from "@/components/home/RecentActivity";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useT } from "@/lib/i18n/LanguageContext";

/** Personalized home shown once a wallet is connected. */
export function Dashboard() {
  const t = useT();
  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-gray-400">{t("dashboard.welcomeBack")}</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {t("dashboard.yourBountyHub")}
        </h1>
      </div>

      <WalletSummary />

      <section>
        <SectionHeader title={t("dashboard.categories")} />
        <CategoryRow />
      </section>

      <FeaturedBounties />
      <RecentActivity />
    </div>
  );
}
