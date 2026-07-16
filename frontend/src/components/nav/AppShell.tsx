import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

/**
 * App frame: desktop top nav + mobile bottom nav, with a centered content
 * column. Adds bottom padding on mobile so content clears the bottom nav.
 */
export function AppShell({
  children,
  maxWidth = "max-w-2xl",
}: {
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <ScrollProgressBar />
      <TopNav />
      <ThemeToggle glass className="fixed right-4 top-4 z-40 md:hidden" />
      <main className={`mx-auto w-full ${maxWidth} animate-fade-up px-4 pb-28 pt-4 md:px-6 md:pb-12 md:pt-8`}>
        {children}
        <Footer />
      </main>
      <BottomNav />
    </div>
  );
}
