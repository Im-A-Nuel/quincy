const STEPS = [
  {
    n: 1,
    title: "Post & lock",
    body: "Poster creates a bounty and locks the cUSD reward in the escrow contract.",
    emoji: "🔒",
  },
  {
    n: 2,
    title: "Claim & work",
    body: "A hunter claims the open bounty and completes the task off-chain.",
    emoji: "🙋",
  },
  {
    n: 3,
    title: "Submit proof",
    body: "Hunter uploads proof to IPFS and submits the link on-chain.",
    emoji: "📎",
  },
  {
    n: 4,
    title: "Approve & pay",
    body: "Poster approves — the contract releases the reward to the hunter instantly.",
    emoji: "✅",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
        How it works
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <div key={s.n} className="card flex gap-3">
            <div className="text-2xl" aria-hidden>
              {s.emoji}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {s.n}. {s.title}
              </p>
              <p className="mt-1 text-sm text-gray-600">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
