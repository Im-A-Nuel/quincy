import { LockIcon, WalletIcon, StarIcon } from "@/components/ui/icons";

const BADGES = [
  { Icon: LockIcon, title: "Non-custodial", body: "Funds live in the contract, never with us." },
  { Icon: WalletIcon, title: "cUSD stable rewards", body: "No volatility between posting and payout." },
  { Icon: StarIcon, title: "On-chain reputation", body: "Every completed bounty is verifiable." },
];

export function TrustBadges() {
  return (
    <section className="py-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {BADGES.map((b) => (
          <div key={b.title} className="flex items-start gap-3 rounded-3xl bg-surface p-5 shadow-soft">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl2 bg-quincy-50 text-quincy-600">
              <b.Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-gray-900">{b.title}</p>
              <p className="mt-0.5 text-sm text-gray-500">{b.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
