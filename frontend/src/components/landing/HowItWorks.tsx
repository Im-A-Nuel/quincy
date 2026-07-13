import { IconTile } from "@/components/ui/IconTile";
import { LockIcon, TasksIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const STEPS = [
  { tint: "indigo" as const, Icon: LockIcon, title: "Post & lock", body: "Create a bounty; the cUSD reward is locked in escrow." },
  { tint: "blue" as const, Icon: TasksIcon, title: "Claim & work", body: "A hunter claims the task and completes it off-chain." },
  { tint: "purple" as const, Icon: ArrowRightIcon, title: "Submit proof", body: "The hunter submits proof of completion on-chain." },
  { tint: "green" as const, Icon: CheckIcon, title: "Approve & pay", body: "You approve; the reward is released instantly." },
];

export function HowItWorks() {
  return (
    <section className="py-10">
      <h2 className="text-center text-2xl font-extrabold text-gray-900">How it works</h2>
      <p className="mt-2 text-center text-sm text-gray-500">Four steps, each a verifiable on-chain transaction.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card text-center">
            <div className="flex justify-center">
              <IconTile tint={s.tint} size="md">
                <s.Icon className="h-6 w-6" />
              </IconTile>
            </div>
            <p className="mt-3 text-xs font-bold text-quincy-500">STEP {i + 1}</p>
            <p className="mt-1 font-bold text-gray-900">{s.title}</p>
            <p className="mt-1 text-sm text-gray-500">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
