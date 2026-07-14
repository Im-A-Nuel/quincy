"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";

/** Fixed mobile bottom navigation with an elevated center Create action. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.04] bg-white/90 backdrop-blur-lg md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          if (item.primary) {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white shadow-pill transition-transform active:scale-95"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex w-16 flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
                  active ? "text-quincy-600" : "text-gray-400"
                }`}
              >
                <Icon className="h-6 w-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
