import type { CapsuleRecord, Language, MediaRecord, UserRecord } from "@/types";

const KEYS = {
  users: "timelock.users",
  session: "timelock.session",
  capsules: "timelock.capsules",
  media: "timelock.media",
  seen: "timelock.seen",
  language: "timelock.language",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/** Accès typé au stockage local (métadonnées). Les fichiers vont dans IndexedDB (voir blobs.ts). */
export const store = {
  users: () => read<UserRecord[]>(KEYS.users, []),
  saveUsers: (value: UserRecord[]) => write(KEYS.users, value),
  session: () => read<string | null>(KEYS.session, null),
  saveSession: (userId: string | null) => {
    if (userId) write(KEYS.session, userId);
    else window.localStorage.removeItem(KEYS.session);
  },
  capsules: () => read<CapsuleRecord[]>(KEYS.capsules, []),
  saveCapsules: (value: CapsuleRecord[]) => write(KEYS.capsules, value),
  media: () => read<MediaRecord[]>(KEYS.media, []),
  saveMedia: (value: MediaRecord[]) => write(KEYS.media, value),
  seen: () => read<string[]>(KEYS.seen, []),
  saveSeen: (value: string[]) => write(KEYS.seen, value),
  language: () => read<Language>(KEYS.language, "fr"),
  saveLanguage: (value: Language) => write(KEYS.language, value),
  clearAll: () => Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key)),
};
