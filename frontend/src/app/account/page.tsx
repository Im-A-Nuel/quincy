"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { AppShell } from "@/components/nav/AppShell";
import { ConnectGate } from "@/components/ConnectGate";
import { Spinner } from "@/components/ui/Spinner";

/** "Profile" tab target: sends a connected wallet to its own public profile. */
export default function AccountPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) router.replace(`/profile/${address}`);
  }, [isConnected, address, router]);

  return (
    <AppShell>
      {isConnected ? (
        <div className="flex justify-center py-16 text-quincy-600">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="py-10">
          <ConnectGate message="Connect your wallet to view your profile." >
            <div />
          </ConnectGate>
        </div>
      )}
    </AppShell>
  );
}
