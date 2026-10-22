"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Crosshair } from "@/components/crosshair";
import { GlassLight } from "@/components/glass-light";
import { getDictionary, type Dictionary } from "@/i18n";
import { currentUser, signIn as authSignIn, signOut as authSignOut, signUp as authSignUp } from "@/lib/auth";
import { createCapsule, deleteCapsule, loadData, mediaUrls, wipeBlobs } from "@/lib/capsule-service";
import { levelFor, nextLockedOf, streakDays, toCapsuleViews, xpFor } from "@/lib/capsules";
import { store } from "@/lib/storage";
import type { CapsuleInput, CapsuleRecord, CapsuleView, Language, MediaRecord, PublicUser } from "@/types";

interface Records {
  capsules: CapsuleRecord[];
  media: MediaRecord[];
  urls: Record<string, string>;
}

const EMPTY: Records = { capsules: [], media: [], urls: {} };

export interface Stats {
  total: number;
  opened: number;
  streak: number;
  xp: number;
  level: number;
  levelProgress: number;
}

interface AppValue {
  ready: boolean;
  language: Language;
  t: Dictionary;
  setLanguage: (language: Language) => void;
  user: PublicUser | null;
  capsules: CapsuleView[];
  nextLocked: CapsuleView | null;
  stats: Stats;
  ceremony: CapsuleView | null;
  dismissCeremony: (capsuleId: string) => void;
  signUp: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  create: (input: CapsuleInput, files: File[]) => Promise<string>;
  remove: (capsuleId: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  toast: string | null;
  notify: (text: string) => void;
}

const AppContext = createContext<AppValue | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<Language>("fr");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [records, setRecords] = useState<Records>(EMPTY);
  const [now, setNow] = useState<number | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async (userId: string) => {
    const data = loadData(userId);
    const urls = await mediaUrls(data.media);
    setRecords({ capsules: data.capsules, media: data.media, urls });
  }, []);

  // Démarrage côté navigateur uniquement
  useEffect(() => {
    const me = currentUser();
    setLanguageState(store.language());
    setSeen(store.seen());
    setUser(me);
    setNow(Date.now());
    const boot = async () => {
      if (me) await load(me.id);
      setReady(true);
    };
    void boot();
  }, [load]);

  // Horloge : compte à rebours et statuts mis à jour chaque seconde
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Rechargement périodique : les capsules dont la date est passée s'ouvrent ainsi
  useEffect(() => {
    if (!user) return;
    const id = window.setInterval(() => {
      void load(user.id);
    }, 15000);
    return () => window.clearInterval(id);
  }, [user, load]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => getDictionary(language), [language]);

  const capsules = useMemo(
    () => (now === null ? [] : toCapsuleViews(records.capsules, records.media, records.urls, now)),
    [records, now],
  );

  const nextLocked = useMemo(() => nextLockedOf(capsules), [capsules]);

  const stats = useMemo<Stats>(() => {
    if (now === null) return { total: 0, opened: 0, streak: 0, xp: 0, level: 1, levelProgress: 0 };
    const opened = capsules.filter((c) => c.unlocked).length;
    const streak = streakDays(records.capsules.map((c) => c.createdAt), now);
    const xp = xpFor({ capsules: records.capsules.length, opened, media: records.media.length, streak });
    const lv = levelFor(xp);
    return { total: records.capsules.length, opened, streak, xp, level: lv.level, levelProgress: lv.progress };
  }, [capsules, records, now]);

  const ceremony = useMemo(
    () => capsules.find((c) => c.unlocked && !seen.includes(c.id)) ?? null,
    [capsules, seen],
  );

  const setLanguage = useCallback((next: Language) => {
    store.saveLanguage(next);
    setLanguageState(next);
  }, []);

  const notify = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast((current) => (current === text ? null : current)), 2600);
  }, []);

  const dismissCeremony = useCallback((capsuleId: string) => {
    setSeen((prev) => {
      if (prev.includes(capsuleId)) return prev;
      const next = [...prev, capsuleId];
      store.saveSeen(next);
      return next;
    });
  }, []);

  const signUp = useCallback((username: string, password: string) => authSignUp(username, password), []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const me = await authSignIn(username, password);
      setUser(me);
      await load(me.id);
    },
    [load],
  );

  const signOut = useCallback(() => {
    authSignOut();
    setUser(null);
    setRecords(EMPTY);
  }, []);

  const create = useCallback(
    async (input: CapsuleInput, files: File[]) => {
      if (!user) throw new Error("not_signed_in");
      const id = await createCapsule(user.id, input, files);
      await load(user.id);
      return id;
    },
    [user, load],
  );

  const remove = useCallback(
    async (capsuleId: string) => {
      if (!user) return;
      await deleteCapsule(user.id, capsuleId);
      await load(user.id);
    },
    [user, load],
  );

  const clearAllData = useCallback(async () => {
    store.clearAll();
    await wipeBlobs();
    setUser(null);
    setRecords(EMPTY);
    setSeen([]);
    setLanguageState("fr");
  }, []);

  const value = useMemo<AppValue>(
    () => ({
      ready,
      language,
      t,
      setLanguage,
      user,
      capsules,
      nextLocked,
      stats,
      ceremony,
      dismissCeremony,
      signUp,
      signIn,
      signOut,
      create,
      remove,
      clearAllData,
      toast,
      notify,
    }),
    [
      ready, language, t, setLanguage, user, capsules, nextLocked, stats, ceremony, dismissCeremony,
      signUp, signIn, signOut, create, remove, clearAllData, toast, notify,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <div className="cp-wallpaper" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <GlassLight />
      <Crosshair />
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProviders");
  return value;
}
