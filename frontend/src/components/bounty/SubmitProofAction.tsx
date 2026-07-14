"use client";

import { useRef, useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { Field, inputClass } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { useSubmitProof } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { uploadProofFile } from "@/lib/upload";

/**
 * Shown to the hunter while a bounty is InProgress. Upload a proof file to IPFS
 * (if configured) or paste a link/CID, then submit the URI on-chain.
 */
export function SubmitProofAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const { submitProof } = useSubmitProof();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uri, setUri] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { uri: cidUri } = await uploadProofFile(file);
      setUri(cidUri);
      toast.success("File uploaded to IPFS");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uri.trim()) {
      setError("Upload a file or paste a link/CID");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await submitProof(bountyId, uri.trim());
      toast.success("Proof submitted for review");
      onDone?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-quincy-200 bg-quincy-50/50 py-4 text-sm font-medium text-quincy-700 transition hover:bg-quincy-50 disabled:opacity-60"
      >
        {uploading ? <Spinner className="h-4 w-4" /> : "📎"}
        {uploading ? "Uploading to IPFS…" : "Upload proof file"}
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

      <Field label="…or paste a link / CID" htmlFor="proof" error={error ?? undefined}>
        <input
          id="proof"
          className={inputClass}
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="https://… or ipfs://CID"
        />
      </Field>

      <TxButton pending={pending} type="submit" className="w-full">
        Submit proof
      </TxButton>
    </form>
  );
}
