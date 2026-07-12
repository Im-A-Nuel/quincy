import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";

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
      <TopNav />
      <main className={`mx-auto w-full ${maxWidth} px-4 pb-28 pt-4 md:px-6 md:pb-12 md:pt-8`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
