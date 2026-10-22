import { describe, expect, it } from "vitest";
import { filterCapsules, isUnlocked, levelFor, streakDays, unlockTime, xpFor } from "@/lib/capsules";

describe("unlocking", () => {
  it("opens at local midnight on the chosen day", () => {
    const at = unlockTime("2030-05-01");
    expect(isUnlocked("2030-05-01", at - 1)).toBe(false);
    expect(isUnlocked("2030-05-01", at)).toBe(true);
  });
});

describe("streak", () => {
  it("counts consecutive days ending today", () => {
    const now = new Date(2030, 4, 10, 12).getTime();
    const day = (d: number) => new Date(2030, 4, d, 9).toISOString();
    expect(streakDays([day(10), day(9), day(8)], now)).toBe(3);
  });

  it("still counts yesterday when nothing was sealed today", () => {
    const now = new Date(2030, 4, 10, 12).getTime();
    const day = (d: number) => new Date(2030, 4, d, 9).toISOString();
    expect(streakDays([day(9), day(8)], now)).toBe(2);
    expect(streakDays([day(7)], now)).toBe(0);
  });
});

describe("level", () => {
  it("starts at level 1 with no progress", () => {
    expect(levelFor(0)).toEqual({ level: 1, progress: 0 });
  });

  it("increases with experience", () => {
    expect(levelFor(500).level).toBeGreaterThan(levelFor(50).level);
  });

  it("grows with activity", () => {
    expect(xpFor({ capsules: 2, opened: 1, media: 1, streak: 1 })).toBe(2 * 50 + 20 + 30 + 10);
  });
});

describe("filtering", () => {
  const base = { message: null, media: [], mediaCount: 0, createdAt: "2030-01-01T00:00:00.000Z" };
  const list = [
    { ...base, id: "a", title: "A", unlockDate: "2031-01-01", unlocked: false },
    { ...base, id: "b", title: "B", unlockDate: "2029-01-01", unlocked: true },
  ];

  it("keeps only the requested state", () => {
    expect(filterCapsules(list, "locked", "soon").map((c) => c.id)).toEqual(["a"]);
    expect(filterCapsules(list, "open", "soon").map((c) => c.id)).toEqual(["b"]);
  });

  it("sorts by opening date", () => {
    expect(filterCapsules(list, "all", "soon").map((c) => c.id)).toEqual(["b", "a"]);
  });
});
