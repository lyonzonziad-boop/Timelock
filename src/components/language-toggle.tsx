"use client";

import { useApp } from "@/context/app-context";
import { Segmented } from "@/components/ui";
import type { Language } from "@/types";

export function LanguageToggle() {
  const { language, setLanguage, t } = useApp();
  return (
    <Segmented<Language>
      label={t.settings.language}
      value={language}
      onChange={setLanguage}
      options={[
        { value: "fr", label: "Français" },
        { value: "en", label: "English" },
      ]}
    />
  );
}
