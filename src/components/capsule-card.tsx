"use client";

import { Download, Lock, LockOpen, Trash2 } from "lucide-react";
import { useApp } from "@/context/app-context";
import { Countdown } from "@/components/countdown";
import { MediaItem } from "@/components/media-item";
import { Button } from "@/components/ui";
import { capsuleAsText, downloadText, safeFilename } from "@/lib/export";
import { formatDate } from "@/lib/format";
import type { CapsuleView } from "@/types";

export function CapsuleCard({ capsule, onDeleted }: { capsule: CapsuleView; onDeleted?: () => void }) {
  const { t, language, remove, notify } = useApp();
  const title = capsule.title || t.card.untitled;
  const dateLabel = formatDate(capsule.unlockDate, language);

  async function onDelete() {
    if (!window.confirm(t.card.confirmDelete)) return;
    await remove(capsule.id);
    notify(t.toast.deleted);
    onDeleted?.();
  }

  function onExport() {
    downloadText(safeFilename(capsule.title), capsuleAsText(capsule, dateLabel));
  }

  return (
    <article className="cp-glass cp-card">
      <header className="cp-card-head">
        <span className={`cp-mark ${capsule.unlocked ? "open" : ""}`} aria-hidden="true">
          {capsule.unlocked ? <LockOpen size={20} /> : <Lock size={20} />}
        </span>
        <div className="cp-grow">
          <h2 className="cp-card-title">{title}</h2>
          <p className="cp-muted cp-small">
            {t.card.opensOn} {dateLabel}
          </p>
        </div>
        <span className={`cp-status ${capsule.unlocked ? "open" : ""}`}>
          {capsule.unlocked ? t.card.opened : t.card.locked}
        </span>
      </header>

      {capsule.unlocked ? (
        <>
          <p className="cp-letter">{capsule.message || t.card.noMessage}</p>
          {capsule.media.length > 0 ? (
            <div className="cp-media">
              {capsule.media.map((m) => (
                <MediaItem key={m.id} media={m} />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <Countdown unlockDate={capsule.unlockDate} createdAt={capsule.createdAt} />
          <p className="cp-muted cp-small">
            {capsule.mediaCount > 0 ? `${t.card.memories(capsule.mediaCount)} · ` : ""}
            {t.card.hidden}
          </p>
        </>
      )}

      <footer className="cp-card-actions">
        {capsule.unlocked && capsule.message ? (
          <Button variant="secondary" onClick={onExport}>
            <Download size={14} aria-hidden="true" />
            {t.card.exportText}
          </Button>
        ) : null}
        <Button variant="danger" onClick={onDelete}>
          <Trash2 size={14} aria-hidden="true" />
          {t.card.delete}
        </Button>
      </footer>
    </article>
  );
}
