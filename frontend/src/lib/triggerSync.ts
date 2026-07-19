/**
 * Fire-and-forget nudge to run the serverless indexer sync shortly after a
 * write, so the acting user sees their own change without waiting for the
 * scheduled cron (capped at once/day on Vercel's Hobby plan - see
 * frontend/vercel.json). Delay gives the tx a couple blocks to confirm
 * before the sync reads contract state. Best-effort only: if it fails or a
 * CRON_SECRET is set server-side, the daily cron still catches it eventually.
 */
export function triggerSyncSoon(delayMs = 8000): void {
  if (typeof window === "undefined") return;
  setTimeout(() => {
    fetch("/api/cron/sync").catch(() => {});
  }, delayMs);
}
