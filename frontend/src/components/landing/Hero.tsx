import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-12 pb-8 text-center">
      <span className="inline-flex items-center gap-1 rounded-full bg-quincy-100 px-3 py-1 text-xs font-medium text-quincy-800">
        Built on Celo · MiniPay-first
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Get paid for micro-tasks,{" "}
        <span className="text-quincy-600">guaranteed by escrow</span>.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        Post a task, lock the cUSD reward in a smart contract, and let a hunter
        claim it. Payment is released on approval — no trust required, no
        middleman holding your funds.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/bounties" className="btn-primary">
          Browse bounties
        </Link>
        <Link href="/create" className="btn-ghost border border-gray-200">
          Post a bounty
        </Link>
      </div>
    </section>
  );
}
