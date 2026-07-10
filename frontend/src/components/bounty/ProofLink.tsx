import { ipfsToUrl } from "@/lib/ipfs";

/** Renders a link to the hunter's submitted proof, if any. */
export function ProofLink({ proofUri }: { proofUri: string | null }) {
  const url = ipfsToUrl(proofUri);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-quincy-700 hover:underline"
    >
      📎 View submitted proof
    </a>
  );
}
