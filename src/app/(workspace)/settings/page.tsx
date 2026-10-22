"use client";

import { useApp } from "@/context/app-context";
import { PageHeader } from "@/components/shell";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui";

export default function SettingsPage() {
  const { t, user, signOut, clearAllData, notify } = useApp();

  async function onClear() {
    if (!window.confirm(t.settings.clearConfirm)) return;
    await clearAllData();
    notify(t.toast.cleared);
  }

  return (
    <div className="cp-stack-lg cp-narrow">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <section className="cp-glass cp-panel cp-stack">
        <h2 className="cp-h2">{t.settings.language}</h2>
        <LanguageToggle />
      </section>

      <section className="cp-glass cp-panel cp-stack">
        <h2 className="cp-h2">{t.settings.account}</h2>
        <p className="cp-muted">{user?.username}</p>
        <div className="cp-row">
          <Button variant="secondary" onClick={() => signOut()}>
            {t.settings.signOut}
          </Button>
        </div>
      </section>

      <section className="cp-glass cp-panel cp-stack">
        <h2 className="cp-h2">{t.settings.storage}</h2>
        <p className="cp-muted cp-small">{t.settings.storageNote}</p>
        <div className="cp-row">
          <Button variant="danger" onClick={onClear}>
            {t.settings.clearData}
          </Button>
        </div>
      </section>
    </div>
  );
}
