import { en, type Dictionary } from "./en";
import { id } from "./id";

export type Locale = "en" | "id";

export const dictionaries: Record<Locale, Dictionary> = { en, id };

export const LOCALE_STORAGE_KEY = "quincy-lang";

export const LOCALES: { value: Locale; labelKey: "english" | "indonesian" }[] = [
  { value: "en", labelKey: "english" },
  { value: "id", labelKey: "indonesian" },
];

export type { Dictionary };
