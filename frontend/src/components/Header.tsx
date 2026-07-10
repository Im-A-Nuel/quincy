import Link from "next/link";
import { WalletButton } from "./WalletButton";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            🪙
          </span>
          <span className="text-lg font-bold text-quincy-700">Quincy</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/bounties" className="btn-ghost hidden sm:inline-flex">
            Browse
          </Link>
          <Link href="/create" className="btn-ghost hidden sm:inline-flex">
            Post
          </Link>
          <WalletButton />
        </nav>
      </div>
    </header>
  );
}
