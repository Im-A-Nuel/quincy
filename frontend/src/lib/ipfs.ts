// Helpers for turning IPFS URIs/CIDs into gateway URLs for display.

const GATEWAY = "https://w3s.link/ipfs/";

/** Convert an ipfs://CID or bare CID into a browser-loadable gateway URL. */
export function ipfsToUrl(uri?: string | null): string | null {
  if (!uri) return null;
  if (uri.startsWith("http://") || uri.startsWith("https://")) return uri;
  const cid = uri.replace(/^ipfs:\/\//, "").replace(/^\/ipfs\//, "");
  return `${GATEWAY}${cid}`;
}
