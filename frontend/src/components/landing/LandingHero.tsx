"use client";

import { WalletButton } from "@/components/WalletButton";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="grid items-center gap-8 py-6 md:grid-cols-2 md:py-12">
      <div className="order-2 text-center md:order-1 md:text-left">
        <span className="inline-flex items-center gap-1 rounded-full bg-quincy-50 px-3 py-1 text-xs font-semibold text-quincy-700">
          Built on Celo · MiniPay-first
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Get work done.
          <br />
          <span className="text-quincy-600">Get paid on-chain.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-gray-500 md:mx-0">
          Post a micro-task, lock the cUSD reward in escrow, and release it on
          approval. Guaranteed by code, not trust.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:items-start md:justify-start">
          <WalletButton />
          <Link href="/bounties" className="btn-ghost">
            Explore bounties
          </Link>
        </div>
      </div>

      <div className="order-1 md:order-2">
        <img
          src="/hero-illustration.webp"
          alt="An escrow vault locked with a glowing padlock, surrounded by floating cUSD coins"
          width={760}
          height={628}
          className="mx-auto w-full max-w-sm animate-float [animation-delay:-2s]"
        />
      </div>
    </section>
  );
}
