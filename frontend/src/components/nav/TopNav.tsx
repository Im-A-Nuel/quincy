"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";
import { WalletButton } from "@/components/WalletButton";

/** Desktop top navigation: logo, primary links, wallet, and a Create CTA. */
export function TopNav() {
  const pathname = usePathname();
  const links = NAV_ITEMS.filter((i) => !i.primary);

  return (
    <header className="sticky top-0 z-30 hidden border-b border-black/[0.04] bg-white/80 backdrop-blur-lg md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icon-quincy.png" alt="Quincy" className="h-9 w-9 rounded-2xl shadow-soft" />
          <span className="text-lg font-extrabold tracking-tight text-quincy-700">Quincy</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-quincy-50 text-quincy-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <WalletButton />
          <Link href="/create" className="btn-primary">
            Post a bounty
          </Link>
        </div>
      </div>
    </header>
  );
}
