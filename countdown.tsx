"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/app-context";
import { unlockTime } from "@/lib/capsules";
import { splitDuration } from "@/lib/format";

export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Countdown({ unlockDate, createdAt }: { unlockDate: string; createdAt: string }) {
  const { t } = useApp();
  const now = useNow();
  const start = new Date(createdAt).getTime();
  const end = unlockTime(unlockDate);
  const parts = now === null ? null : splitDuration(end - now);
  const progress = now === null ? 0 : Math.min(1, Math.max(0, (now - start) / Math.max(1, end - start)));

  const cells: [number | string, string][] = [
    [parts ? parts.days : "--", t.card.days],
    [parts ? String(parts.hours).padStart(2, "0") : "--", t.card.hours],
    [parts ? String(parts.minutes).padStart(2, "0") : "--", t.card.minutes],
    [parts ? String(parts.seconds).padStart(2, "0") : "--", t.card.seconds],
  ];

  return (
    <div className="cp-countdown">
      <div className="cp-ring" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <circle className="cp-ring-bg" cx="22" cy="22" r={RADIUS} />
          <circle
            className="cp-ring-fg"
            cx="22"
            cy="22"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
      </div>
      <div className="cp-cells">
        {cells.map(([value, label]) => (
          <div className="cp-cell" key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
