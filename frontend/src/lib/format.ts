// Small formatting helpers used across the UI.

/** Shorten a wallet address: 0x1234…abcd */
export function shortAddress(addr?: string | null): string {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Format a cUSD decimal string with a currency suffix. */
export function formatCusd(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return "0 cUSD";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} cUSD`;
}

/** Relative-time string for a timestamp, e.g. "in 3 days" / "2 hours ago". */
export function timeUntil(iso: string): string {
  const target = new Date(iso).getTime();
  const diffMs = target - Date.now();
  const abs = Math.abs(diffMs);
  const mins = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);

  let value: string;
  if (mins < 60) value = `${mins} min`;
  else if (hours < 24) value = `${hours} hour${hours === 1 ? "" : "s"}`;
  else value = `${days} day${days === 1 ? "" : "s"}`;

  return diffMs >= 0 ? `in ${value}` : `${value} ago`;
}

/** True when a deadline has passed. */
export function isExpired(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}
