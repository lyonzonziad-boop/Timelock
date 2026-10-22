import en from "@/i18n/en";
import fr from "@/i18n/fr";
import type { Language } from "@/types";

export type Dictionary = typeof en;

const dictionaries: Record<Language, Dictionary> = {
  en,
  fr: fr as unknown as Dictionary,
};

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language];
}
