export interface UploadResult {
  cid: string;
  uri: string;
}

/** Upload a proof file to IPFS through the app's /api/upload route. */
export async function uploadProofFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) {
    let message = "Upload failed";
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      /* non-JSON */
    }
    throw new Error(message);
  }
  return res.json() as Promise<UploadResult>;
}
