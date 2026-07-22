"use client";

import { useAccount } from "wagmi";
import { AppShell } from "@/components/nav/AppShell";
import { Landing } from "@/components/landing/Landing";
import { Dashboard } from "@/components/home/Dashboard";

export default function HomePage() {
  const { isConnected } = useAccount();
  return (
    <AppShell maxWidth={isConnected ? "max-w-2xl" : "max-w-5xl"} hideBottomNav={!isConnected}>
      {isConnected ? <Dashboard /> : <Landing />}
    </AppShell>
  );
}
