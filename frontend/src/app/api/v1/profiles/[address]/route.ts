import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/server/db";
import { mapReputation } from "@/lib/server/rows";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { address: string } },
) {
  const address = params.address.toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid wallet address" } },
      { status: 400 },
    );
  }

  try {
    const pool = getPool();
    const rows = await pool.query("SELECT * FROM reputations WHERE wallet_address = $1", [address]);
    // A wallet with no activity returns a zeroed object, not a 404.
    return NextResponse.json(mapReputation(rows.rows[0], address));
  } catch (err) {
    return NextResponse.json(
      { error: { code: "INDEXER_ERROR", message: (err as Error).message } },
      { status: 500 },
    );
  }
}
