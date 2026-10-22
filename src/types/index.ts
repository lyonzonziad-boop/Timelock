export type Language = "fr" | "en";
export type MediaKind = "image" | "video" | "audio";
export type CapsuleFilter = "all" | "locked" | "open";
export type CapsuleSort = "soon" | "new";

/** Compte stocké dans le navigateur (mot de passe haché, jamais en clair). */
export interface UserRecord {
  id: string;
  username: string;
  salt: string;
  hash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
}

/** Capsule telle qu'enregistrée. Le message n'est exposé qu'à l'ouverture. */
export interface CapsuleRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  unlockDate: string; // AAAA-MM-JJ
  createdAt: string; // ISO
}

/** Métadonnées d'un fichier joint. Le fichier lui-même est dans IndexedDB. */
export interface MediaRecord {
  id: string;
  capsuleId: string;
  userId: string;
  kind: MediaKind;
  mime: string;
  name: string;
}

export interface MediaView {
  id: string;
  kind: MediaKind;
  name: string;
  url: string;
}

/** Capsule telle qu'affichée : message et médias masqués tant qu'elle est scellée. */
export interface CapsuleView {
  id: string;
  title: string;
  message: string | null;
  unlockDate: string;
  createdAt: string;
  unlocked: boolean;
  mediaCount: number;
  media: MediaView[];
}

export interface CapsuleInput {
  title: string;
  message: string;
  unlockDate: string;
}
