import Link from "next/link";
import { LandingHero } from "./LandingHero";
import { TrustBadges } from "./TrustBadges";
import { HowItWorks } from "./HowItWorks";

/** Marketing view shown at "/" for visitors who haven't connected a wallet. */
export function Landing() {
  return (
    <div>
      <LandingHero />
      <TrustBadges />
      <HowItWorks />

      <section className="py-8">
        <div className="rounded-4xl bg-gradient-primary px-6 py-10 text-center text-white shadow-float">
          <h2 className="text-2xl font-extrabold">Ready to ship a task?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            Connect inside MiniPay and post your first escrow-backed bounty in a minute.
          </p>
          <Link href="/create" className="btn mt-6 bg-white text-quincy-700 hover:bg-quincy-50">
            Post a bounty
          </Link>
        </div>
      </section>
    </div>
  );
}
