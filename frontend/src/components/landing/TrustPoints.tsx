const POINTS = [
  {
    title: "Non-custodial",
    body: "Funds live in the smart contract, never in our hands. We can't touch them.",
    emoji: "🛡️",
  },
  {
    title: "cUSD stable rewards",
    body: "Rewards are paid in cUSD — no volatility between posting and payout.",
    emoji: "💵",
  },
  {
    title: "On-chain reputation",
    body: "Every completed bounty builds a public, verifiable track record.",
    emoji: "⭐",
  },
];

export function TrustPoints() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="text-center">
            <div className="text-3xl" aria-hidden>
              {p.emoji}
            </div>
            <p className="mt-2 font-semibold text-gray-900">{p.title}</p>
            <p className="mt-1 text-sm text-gray-600">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
