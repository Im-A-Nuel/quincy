"use client";

import { ipfsToUrl } from "@/lib/ipfs";
import { useT } from "@/lib/i18n/LanguageContext";

/** Renders a link to the hunter's submitted proof, if any. */
export function ProofLink({ proofUri }: { proofUri: string | null }) {
  const t = useT();
  const url = ipfsToUrl(proofUri);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-quincy-700 hover:underline"
    >
      {t("bounty.viewProof")}
    </a>
  );
}
