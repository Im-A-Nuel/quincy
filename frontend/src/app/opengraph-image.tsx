import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quincy - escrow-backed micro-task bounties on Celo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            Q
          </div>
          <div style={{ fontSize: 52, fontWeight: 800 }}>Quincy</div>
        </div>

        <div style={{ marginTop: 48, fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
          Get work done.
          <br />
          Get paid on-chain.
        </div>

        <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
          Escrow-backed micro-task bounties on Celo · MiniPay-first
        </div>
      </div>
    ),
    size,
  );
}
