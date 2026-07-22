"use client";

import { useRef, useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { Field, inputClass } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { useSubmitProof } from "@/hooks/useBountyActions";
import { useToast } from "@/components/toast/ToastContext";
import { uploadProofFile } from "@/lib/upload";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * Shown to the hunter while a bounty is InProgress. Upload a proof file to IPFS
 * (if configured) or paste a link/CID, then submit the URI on-chain.
 */
export function SubmitProofAction({ bountyId, onDone }: { bountyId: number; onDone?: () => void }) {
  const t = useT();
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
      toast.success(t("bounty.uploadSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("bounty.uploadFailed"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uri.trim()) {
      setError(t("bounty.submitProofRequired"));
      return;
    }
    setError(null);
    setPending(true);
    try {
      await submitProof(bountyId, uri.trim());
      toast.success(t("bounty.submitProofSuccess"));
      onDone?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("bounty.submitProofFailed"));
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
        {uploading ? t("bounty.uploadingToIpfs") : t("bounty.uploadProofFile")}
      </button>
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

      <Field label={t("bounty.pasteLinkOrCid")} htmlFor="proof" error={error ?? undefined}>
        <input
          id="proof"
          className={inputClass}
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder={t("bounty.pasteLinkPlaceholder")}
        />
      </Field>

      <TxButton pending={pending} type="submit" className="w-full">
        {t("bounty.submitProof")}
      </TxButton>
    </form>
  );
}
