"use client";

import { AppShell } from "@/components/nav/AppShell";
import { useTheme, type ThemeMode } from "@/hooks/useTheme";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const THEME_OPTIONS: { value: ThemeMode; labelKey: "light" | "dark" }[] = [
  { value: "light", labelKey: "light" },
  { value: "dark", labelKey: "dark" },
];

/** Preferences page: theme and language. The only place either can be changed. */
export default function SettingsPage() {
  const t = useT();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLanguage();

  return (
    <AppShell maxWidth="max-w-xl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">{t("settings.title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("settings.subtitle")}</p>
      </div>

      <div className="space-y-4">
        <section className="card-float">
          <h2 className="font-bold text-gray-900">{t("settings.appearance")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("settings.theme")}</p>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label={t("settings.theme")}>
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(opt.value)}
                  className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "border-quincy-600 bg-quincy-50 text-quincy-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t(`settings.${opt.labelKey}`)}
                </button>
              );
            })}
          </div>
        </section>

        <section className="card-float">
          <h2 className="font-bold text-gray-900">{t("settings.language")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("settings.languageHint")}</p>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label={t("settings.language")}>
            {LOCALES.map((opt) => {
              const active = locale === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setLocale(opt.value as Locale)}
                  className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "border-quincy-600 bg-quincy-50 text-quincy-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t(`settings.${opt.labelKey}`)}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
