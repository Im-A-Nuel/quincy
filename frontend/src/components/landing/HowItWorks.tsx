import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { art: "/step-post-lock.webp", title: "Post & lock", body: "Create a bounty; the cUSD reward is locked in escrow." },
  { art: "/step-claim-work.webp", title: "Claim & work", body: "A hunter claims the task and completes it off-chain." },
  { art: "/step-submit-proof.webp", title: "Submit proof", body: "The hunter submits proof of completion on-chain." },
  { art: "/step-approve-pay.webp", title: "Approve & pay", body: "You approve; the reward is released instantly." },
];

export function HowItWorks() {
  return (
    <section className="py-10">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">How it works</h2>
        <p className="mt-2 text-center text-sm text-gray-500">Four steps, each a verifiable on-chain transaction.</p>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delayMs={i * 100}>
            <div className="card text-center">
              <div className="flex justify-center">
                <img src={s.art} alt="" width={96} height={96} className="h-24 w-24" />
              </div>
              <p className="mt-2 text-xs font-bold text-quincy-500">STEP {i + 1}</p>
              <p className="mt-1 font-bold text-gray-900">{s.title}</p>
              <p className="mt-1 text-sm text-gray-500">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
