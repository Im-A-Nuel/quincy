"use client";

import { LockIcon } from "@/components/ui/icons";
import { useT } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const t = useT();
  const badges = [t("footer.builtOnCelo"), t("footer.poweredByCusd"), t("footer.availableOnMiniPay")];
  return (
    <footer className="mt-16 border-t border-black/[0.05] pt-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {badges.map((b) => (
          <span
            key={b}
            className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-soft"
          >
            {b}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
        <LockIcon className="h-4 w-4 text-quincy-400" />
        {t("footer.fundsNote")}
      </p>
      <p className="mt-1 text-center text-[11px] text-gray-400">
        © {new Date().getFullYear()} Quincy
      </p>
    </footer>
  );
}
