import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/server/db";
import { mapBountyListItem } from "@/lib/server/rows";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const SORTS: Record<string, string> = {
  newest: "created_at DESC",
  reward_desc: "reward_amount DESC",
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  const category = params.get("category");
  const involves = params.get("involves");
  const q = params.get("q");
  const sort = SORTS[params.get("sort") ?? "newest"] ?? SORTS.newest;
  const page = Math.max(1, Number(params.get("page") ?? "1"));

  const where: string[] = [];
  const args: unknown[] = [];
  const add = (clause: string, value: unknown) => {
    args.push(value);
    where.push(clause.replace("?", `$${args.length}`));
  };

  if (status) add("status = ?", status);
  if (category) add("category = ?", category);
  if (involves) {
    args.push(involves.toLowerCase());
    where.push(`(poster_address = $${args.length} OR hunter_address = $${args.length})`);
  }
  if (q) {
    args.push(`%${q}%`);
    where.push(`title ILIKE $${args.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  try {
    const pool = getPool();
    const totalRes = await pool.query(`SELECT COUNT(*)::int AS n FROM bounties ${whereSql}`, args);
    const total = totalRes.rows[0]?.n ?? 0;

    const rows = await pool.query(
      `SELECT id, title, category, reward_token, reward_amount, status, poster_address, deadline
       FROM bounties ${whereSql}
       ORDER BY ${sort}
       LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
      args,
    );

    return NextResponse.json({
      bounties: rows.rows.map(mapBountyListItem),
      page,
      total,
    });
  } catch (err) {
    return NextResponse.json(
      { error: { code: "INDEXER_ERROR", message: (err as Error).message } },
      { status: 500 },
    );
  }
}
