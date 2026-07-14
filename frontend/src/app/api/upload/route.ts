import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Pin an uploaded proof file to IPFS via Pinata and return its CID/URI. The
 * hunter's wallet still submits the URI on-chain; this route only stores the
 * file. Requires PINATA_JWT; without it, uploads are disabled (paste a link).
 */
export async function POST(req: NextRequest) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return NextResponse.json(
      { error: { code: "UPLOAD_DISABLED", message: "File upload is not configured. Paste a link instead." } },
      { status: 501 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "No file provided" } },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: { code: "TOO_LARGE", message: "File exceeds 10 MB" } },
      { status: 413 },
    );
  }

  const pinataForm = new FormData();
  pinataForm.append("file", file, file.name);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { authorization: `Bearer ${jwt}` },
    body: pinataForm,
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: { code: "PIN_FAILED", message: `Pinning failed: ${detail.slice(0, 200)}` } },
      { status: 502 },
    );
  }

  const data = (await res.json()) as { IpfsHash: string };
  return NextResponse.json({ cid: data.IpfsHash, uri: `ipfs://${data.IpfsHash}` });
}
