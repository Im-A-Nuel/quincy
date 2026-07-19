/**
 * Fire-and-forget nudge to run the serverless indexer sync shortly after a
 * write, so the acting user sees their own change without waiting for the
 * scheduled cron (capped at once/day on Vercel's Hobby plan - see
 * frontend/vercel.json). Delay gives the tx a couple blocks to confirm
 * before the sync reads contract state. Hits /api/sync-now, the
 * unauthenticated counterpart to the CRON_SECRET-protected /api/cron/sync,
 * since the browser has no way to know that secret. Best-effort only: if it
 * fails, the daily cron still catches it eventually.
 */
export function triggerSyncSoon(delayMs = 8000): void {
  if (typeof window === "undefined") return;
  setTimeout(() => {
    fetch("/api/sync-now").catch(() => {});
  }, delayMs);
}
