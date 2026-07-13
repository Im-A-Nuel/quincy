import { WalletSummary } from "@/components/home/WalletSummary";
import { CategoryRow } from "@/components/home/CategoryRow";
import { FeaturedBounties } from "@/components/home/FeaturedBounties";
import { RecentActivity } from "@/components/home/RecentActivity";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Personalized home shown once a wallet is connected. */
export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <p className="text-sm font-medium text-gray-400">Welcome back</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Your bounty hub
        </h1>
      </div>

      <WalletSummary />

      <section>
        <SectionHeader title="Categories" />
        <CategoryRow />
      </section>

      <FeaturedBounties />
      <RecentActivity />
    </div>
  );
}
