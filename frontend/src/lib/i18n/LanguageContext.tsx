"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, LOCALE_STORAGE_KEY, type Locale } from "./index";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "id") return stored;
    if (navigator.language?.toLowerCase().startsWith("id")) return "id";
  } catch {
    /* ignore - SSR or storage unavailable */
  }
  return "en";
}

/** Provides the active locale app-wide, persisted to localStorage. Language is
 *  only ever changed from the Settings page (see /settings), never inline. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Translate hook. `t("bounty.claimThisBounty")` looks up the nested key in
 * the active locale's dictionary; `{var}` placeholders are substituted from
 * the optional second argument. Falls back to the raw key if missing, so a
 * typo never crashes the page - just shows visibly wrong text.
 */
export function useT() {
  const { locale } = useLanguage();
  return useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const raw = resolvePath(dictionaries[locale], key);
      let text = typeof raw === "string" ? raw : key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale],
  );
}
