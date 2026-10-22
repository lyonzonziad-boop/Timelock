"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useApp } from "@/context/app-context";
import { MediaItem } from "@/components/media-item";
import { Button } from "@/components/ui";

/** Fenêtre d'ouverture : affichée une fois pour chaque capsule qui vient de s'ouvrir. */
export function Ceremony() {
  const { ceremony, dismissCeremony, t } = useApp();
  const [typed, setTyped] = useState("");
  const capsuleId = ceremony?.id;
  const full = ceremony ? (ceremony.message ?? t.ceremony.noMessage) : "";
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!capsuleId) return;
    if (reduced) {
      setTyped(full);
      return;
    }
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [capsuleId, full, reduced]);

  if (!ceremony) return null;

  return (
    <div className="cp-overlay" role="dialog" aria-modal="true" aria-labelledby="cer-title">
      <div className="cp-glass cp-ceremony">
        <span className="cp-mark open" aria-hidden="true">
          <Gift size={26} />
        </span>
        <h2 id="cer-title" className="cp-ceremony-title">
          {ceremony.title || t.card.untitled}
        </h2>
        <p className="cp-letter cp-letter-left">{typed}</p>
        {ceremony.media.length > 0 ? (
          <div className="cp-media">
            {ceremony.media.map((m) => (
              <MediaItem key={m.id} media={m} />
            ))}
          </div>
        ) : null}
        <Button onClick={() => dismissCeremony(ceremony.id)}>{t.ceremony.close}</Button>
      </div>
    </div>
  );
}
