import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quincy - escrow-backed micro-task bounties on Celo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** ArrayBuffer -> base64 data URI without relying on Node's Buffer (edge-safe). */
function toDataUri(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:image/png;base64,${btoa(binary)}`;
}

export default async function OgImage() {
  const vaultBuffer = await fetch(new URL("./og-vault.png", import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );
  const vault = toDataUri(vaultBuffer);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <img src={vault} width={420} height={347} style={{ marginRight: 48 }} />

        <div style={{ display: "flex", flexDirection: "column", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Q
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>Quincy</div>
          </div>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            <span>Get work done.</span>
            <span>Get paid on-chain.</span>
          </div>

          <div
            style={{
              marginTop: 24,
              width: 560,
              fontSize: 25,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Escrow-backed micro-task bounties on Celo · MiniPay-first
          </div>
        </div>
      </div>
    ),
    size,
  );
}
