"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, isActive } from "./navItems";
import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExploreIcon } from "@/components/ui/icons";
import { useScrolled } from "@/hooks/useScrolled";

/** Desktop top navigation: logo, primary links, search, wallet, and a Create CTA. */
export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const links = NAV_ITEMS.filter((i) => !i.primary);
  const scrolled = useScrolled(24);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/bounties?q=${encodeURIComponent(q.trim())}` : "/bounties");
  };

  return (
    <header
      className={`glass sticky top-0 z-30 hidden border-b border-black/[0.04] transition-shadow duration-300 ease-soft md:block ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center gap-6 px-6 transition-[padding] duration-300 ease-soft ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 transition-transform duration-200 ease-soft hover:scale-[1.03] active:scale-95">
          <img
            src="/icon-quincy.png"
            alt="Quincy"
            className={`rounded-2xl shadow-soft transition-all duration-300 ease-soft ${
              scrolled ? "h-7 w-7" : "h-9 w-9"
            }`}
          />
          <span
            className={`font-extrabold tracking-tight text-quincy-700 transition-all duration-300 ease-soft ${
              scrolled ? "text-base" : "text-lg"
            }`}
          >
            Quincy
          </span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {links.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-soft active:scale-95 ${
                isActive(pathname, item.href)
                  ? "bg-quincy-50 text-quincy-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} role="search" className="relative ml-auto hidden lg:block">
          <label htmlFor="nav-search" className="sr-only">
            Search bounties
          </label>
          <ExploreIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="nav-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-52 rounded-full border border-black/[0.06] bg-canvas py-2 pl-9 pr-3 text-sm outline-none focus:border-quincy-300 focus:ring-2 focus:ring-quincy-100"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 lg:ml-3">
          <ThemeToggle />
          <WalletButton />
          <Link href="/create" className="btn-primary">
            Post a bounty
          </Link>
        </div>
      </div>
    </header>
  );
}
