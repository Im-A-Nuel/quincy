"use client";

import Link from "next/link";
import { SearchArt } from "@/components/illustrations/spot";
import { useT } from "@/lib/i18n/LanguageContext";

export default function NotFound() {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="w-40">
        <SearchArt />
      </div>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{t("notFound.hint")}</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          {t("notFound.goHome")}
        </Link>
        <Link href="/bounties" className="btn-ghost">
          {t("common.exploreBounties")}
        </Link>
      </div>
    </div>
  );
}
