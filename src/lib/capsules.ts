import type { CapsuleFilter, CapsuleRecord, CapsuleSort, CapsuleView, MediaRecord } from "@/types";

/** Ouverture à minuit (heure locale) le jour choisi. */
export function unlockTime(isoDay: string): number {
  return new Date(`${isoDay}T00:00:00`).getTime();
}

export function startOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function isUnlocked(isoDay: string, now: number): boolean {
  return now >= unlockTime(isoDay);
}

/** Construit les vues : message et médias restent vides tant que la capsule est scellée. */
export function toCapsuleViews(
  records: CapsuleRecord[],
  media: MediaRecord[],
  urls: Record<string, string>,
  now: number,
): CapsuleView[] {
  return records
    .map((r) => {
      const unlocked = isUnlocked(r.unlockDate, now);
      const items = media.filter((m) => m.capsuleId === r.id);
      return {
        id: r.id,
        title: r.title,
        message: unlocked ? r.message : null,
        unlockDate: r.unlockDate,
        createdAt: r.createdAt,
        unlocked,
        mediaCount: items.length,
        media: unlocked
          ? items.map((m) => ({ id: m.id, kind: m.kind, name: m.name, url: urls[m.id] ?? "" })).filter((m) => m.url)
          : [],
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Jours consécutifs avec au moins une capsule scellée, en comptant aujourd'hui (ou hier si rien aujourd'hui). */
export function streakDays(createdAts: string[], now: number): number {
  const days = new Set(createdAts.map((s) => new Date(s).toDateString()));
  const d = new Date(now);
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(d.toDateString())) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export interface XpInput {
  capsules: number;
  opened: number;
  media: number;
  streak: number;
}

export function xpFor(input: XpInput): number {
  return input.capsules * 50 + input.media * 20 + input.opened * 30 + input.streak * 10;
}

const threshold = (n: number) => 100 * Math.pow(n, 1.6);

export function levelFor(xp: number): { level: number; progress: number } {
  let level = 1;
  while (xp >= threshold(level)) level++;
  const base = level > 1 ? threshold(level - 1) : 0;
  const next = threshold(level);
  return { level, progress: Math.min(1, Math.max(0, (xp - base) / (next - base))) };
}

export function nextLockedOf(list: CapsuleView[]): CapsuleView | null {
  return list.filter((c) => !c.unlocked).sort((a, b) => a.unlockDate.localeCompare(b.unlockDate))[0] ?? null;
}

export function filterCapsules(list: CapsuleView[], filter: CapsuleFilter, sort: CapsuleSort): CapsuleView[] {
  const kept = list.filter((c) => filter === "all" || (filter === "open" ? c.unlocked : !c.unlocked));
  return [...kept].sort((a, b) =>
    sort === "soon" ? a.unlockDate.localeCompare(b.unlockDate) : b.createdAt.localeCompare(a.createdAt),
  );
}
