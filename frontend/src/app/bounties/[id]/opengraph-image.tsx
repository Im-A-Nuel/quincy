import { ImageResponse } from "next/og";
import { getPool } from "@/lib/server/db";
import { formatCusd } from "@/lib/format";

export const runtime = "nodejs";
export const alt = "Quincy bounty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadBounty(id: number) {
  try {
    const pool = getPool();
    const { rows } = await pool.query(
      "SELECT title, reward_amount, status FROM bounties WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function BountyOg({ params }: { params: { id: string } }) {
  const bounty = await loadBounty(Number(params.id));
  const title = bounty?.title ?? "A bounty on Quincy";
  const reward = bounty ? formatCusd(String(bounty.reward_amount)) : "";
  const status = (bounty?.status ?? "").replace("_", " ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          background: "#0b0e16",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            Q
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>Quincy</div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 56, fontWeight: 800, lineHeight: 1.15 }}>
          {title}
        </div>

        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 24 }}>
          {reward && (
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: "#a5b4fc",
              }}
            >
              {reward}
            </div>
          )}
          {status && (
            <div
              style={{
                fontSize: 26,
                padding: "8px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.1)",
                textTransform: "capitalize",
              }}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
