"use client";

import type { Bounty } from "@/lib/types";
import { formatToken } from "@/lib/format";
import { tokenSymbol } from "@/lib/chains";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * Share a completed bounty to Farcaster via a Warpcast compose intent. The
 * bounty URL is embedded so the cast shows the OG card.
 */
export function ShareButton({ bounty }: { bounty: Bounty }) {
  const t = useT();
  const handleShare = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/bounties/${bounty.id}`;
    const text =
      `Just completed a bounty on Quincy and got paid ${formatToken(bounty.rewardAmount, tokenSymbol(bounty.rewardToken))}, ` +
      `released on-chain via escrow. No middleman. ✅`;
    const compose =
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}` +
      `&embeds[]=${encodeURIComponent(url)}`;
    window.open(compose, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleShare} className="btn-primary w-full">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 3h16v3h-2v15h-3v-7c0-1.7-1.3-3-3-3s-3 1.3-3 3v7H6V6H4V3z" />
      </svg>
      {t("bounty.shareToFarcaster")}
    </button>
  );
}
