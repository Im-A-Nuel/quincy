// Small formatting helpers used across the UI.

/** Shorten a wallet address: 0x1234…abcd */
export function shortAddress(addr?: string | null): string {
  if (!addr) return "-";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/** Format a decimal amount with a token symbol suffix (cUSD or CELO). */
export function formatToken(amount: string | number, symbol = "cUSD"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return `0 ${symbol}`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${symbol}`;
}

/** Relative-time string for a timestamp, e.g. "in 3 days" / "2 hours ago" -
 *  localized via Intl.RelativeTimeFormat (both "en" and "id" are natively
 *  supported, including Indonesian's own pluralization/phrasing). */
export function timeUntil(iso: string, locale: string = "en"): string {
  const target = new Date(iso).getTime();
  const diffMs = target - Date.now();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (abs < 3_600_000) return rtf.format(Math.round(diffMs / 60_000), "minute");
  if (abs < 86_400_000) return rtf.format(Math.round(diffMs / 3_600_000), "hour");
  return rtf.format(Math.round(diffMs / 86_400_000), "day");
}

/** True when a deadline has passed. */
export function isExpired(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}
