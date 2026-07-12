import { AppShell } from "@/components/nav/AppShell";
import { WalletSummary } from "@/components/home/WalletSummary";
import { CategoryRow } from "@/components/home/CategoryRow";
import { FeaturedBounties } from "@/components/home/FeaturedBounties";
import { RecentActivity } from "@/components/home/RecentActivity";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="animate-fade-up">
          <p className="text-sm font-medium text-gray-400">Welcome to</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Quincy <span className="text-quincy-500">·</span> get things done
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
    </AppShell>
  );
}
