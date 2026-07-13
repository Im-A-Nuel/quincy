import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/server/db";
import { mapBounty } from "@/lib/server/rows";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Invalid bounty id" } },
      { status: 400 },
    );
  }

  try {
    const pool = getPool();
    const rows = await pool.query("SELECT * FROM bounties WHERE id = $1", [id]);
    if (rows.rows.length === 0) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: `Bounty with id ${id} does not exist` } },
        { status: 404 },
      );
    }
    return NextResponse.json(mapBounty(rows.rows[0]));
  } catch (err) {
    return NextResponse.json(
      { error: { code: "INDEXER_ERROR", message: (err as Error).message } },
      { status: 500 },
    );
  }
}
