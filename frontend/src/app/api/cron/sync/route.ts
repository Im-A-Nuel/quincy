import { NextRequest, NextResponse } from "next/server";
import { syncOnce } from "@/lib/server/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Serverless replacement for the standalone indexer's poll loop: processes
 * one bounded range of new blocks and returns. Triggered on a schedule by
 * Vercel Cron (see vercel.json) instead of running as an always-on worker.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
    }
  }

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
