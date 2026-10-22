import type { MediaKind } from "@/types";
import { startOfDay, unlockTime } from "@/lib/capsules";

export const MAX_UPLOAD_BYTES = 80 * 1024 * 1024;
export const MAX_TITLE = 80;
export const MAX_MESSAGE = 5000;
const USERNAME_RE = /^[a-z0-9_.-]{3,20}$/;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string): boolean {
  return USERNAME_RE.test(normalizeUsername(value));
}

export function isValidPassword(value: string): boolean {
  return value.length >= 10;
}

export function mediaKindOf(mime: string): MediaKind | null {
  const base = mime.split(";")[0].trim().toLowerCase();
  if (base.startsWith("image/")) return "image";
  if (base.startsWith("video/")) return "video";
  if (base.startsWith("audio/")) return "audio";
  return null;
}

export type FileIssue = "too_large" | "unsupported";

export function checkFile(file: { size: number; type: string }): { kind: MediaKind } | { issue: FileIssue } {
  if (file.size > MAX_UPLOAD_BYTES) return { issue: "too_large" };
  const kind = mediaKindOf(file.type);
  return kind ? { kind } : { issue: "unsupported" };
}

export type CapsuleIssue = "empty" | "date_missing" | "date_past";

export function validateCapsule(
  input: { title: string; message: string; unlockDate: string },
  now: number,
): CapsuleIssue | null {
  if (!input.title.trim() && !input.message.trim()) return "empty";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.unlockDate)) return "date_missing";
  if (unlockTime(input.unlockDate) <= startOfDay(now)) return "date_past";
  return null;
}
