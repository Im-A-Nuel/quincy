import { Reveal } from "@/components/ui/Reveal";

const BADGES = [
  { art: "/badge-non-custodial.webp", title: "Non-custodial", body: "Funds live in the contract, never with us." },
  { art: "/badge-cusd-rewards.webp", title: "cUSD stable rewards", body: "No volatility between posting and payout." },
  { art: "/badge-onchain-reputation.webp", title: "On-chain reputation", body: "Every completed bounty is verifiable." },
];

export function TrustBadges() {
  return (
    <section className="py-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {BADGES.map((b, i) => (
          <Reveal key={b.title} delayMs={i * 100}>
            <div className="flex items-start gap-3 rounded-3xl bg-surface p-5 shadow-soft">
              <img src={b.art} alt="" width={56} height={56} className="h-14 w-14 shrink-0" />
              <div>
                <p className="font-bold text-gray-900">{b.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{b.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
