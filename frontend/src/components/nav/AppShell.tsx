import type { ReactNode } from "react";
import Link from "next/link";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { SettingsIcon } from "@/components/ui/icons";
import { Footer } from "@/components/Footer";

/**
 * App frame: desktop top nav + mobile bottom nav, with a centered content
 * column. Adds bottom padding on mobile so content clears the bottom nav.
 * `hideBottomNav` is used by the marketing landing page, which has its own
 * scroll-heavy layout and no wallet-scoped destinations to jump to yet.
 */
export function AppShell({
  children,
  maxWidth = "max-w-2xl",
  hideBottomNav = false,
}: {
  children: ReactNode;
  maxWidth?: string;
  hideBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <ScrollProgressBar />
      <TopNav />
      <Link
        href="/settings"
        aria-label="Settings"
        className="glass fixed right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full text-gray-600 shadow-soft transition-all duration-200 ease-soft hover:-translate-y-px hover:text-quincy-600 hover:shadow-md active:scale-90 md:hidden"
      >
        <SettingsIcon className="h-5 w-5" />
      </Link>
      <main className={`mx-auto w-full ${maxWidth} animate-fade-up px-4 pb-28 pt-4 md:px-6 md:pb-12 md:pt-8`}>
        {children}
        <Footer />
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
