import { NextResponse } from "next/server";
import { syncOnce } from "@/lib/server/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Unauthenticated counterpart to /api/cron/sync, meant to be called from the
 * browser right after a wallet write (see triggerSyncSoon in
 * frontend/src/lib/triggerSync.ts) so the acting user sees their own change
 * without waiting for the scheduled cron. No CRON_SECRET check here on
 * purpose - the client can't know a server secret, and this route can't move
 * funds or touch anything but the indexed read-copy, so being publicly
 * callable is low-risk: worst case is redundant, idempotent upserts and a
 * bit of wasted RPC/DB time.
 */
export async function GET() {
  try {
    const result = await syncOnce();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
