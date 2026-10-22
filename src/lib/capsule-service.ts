import { blobUrl, clearBlobs, deleteBlob, putBlob } from "@/lib/blobs";
import { createId } from "@/lib/id";
import { store } from "@/lib/storage";
import { checkFile, MAX_MESSAGE, MAX_TITLE, validateCapsule } from "@/lib/validation";
import type { CapsuleInput, CapsuleRecord, MediaRecord } from "@/types";

export type CapsuleErrorCode = "empty" | "date_missing" | "date_past" | "file_too_large" | "file_unsupported";

export class CapsuleError extends Error {
  readonly code: CapsuleErrorCode;
  constructor(code: CapsuleErrorCode) {
    super(code);
    this.name = "CapsuleError";
    this.code = code;
  }
}

export function loadData(userId: string): { capsules: CapsuleRecord[]; media: MediaRecord[] } {
  return {
    capsules: store.capsules().filter((c) => c.userId === userId),
    media: store.media().filter((m) => m.userId === userId),
  };
}

export async function mediaUrls(media: MediaRecord[]): Promise<Record<string, string>> {
  const entries = await Promise.all(
    media.map(async (m) => [m.id, (await blobUrl(m.id)) ?? ""] as const),
  );
  return Object.fromEntries(entries);
}

export async function createCapsule(userId: string, input: CapsuleInput, files: File[]): Promise<string> {
  const now = Date.now();
  const issue = validateCapsule(input, now);
  if (issue) throw new CapsuleError(issue);

  const checked = files.map((file) => {
    const result = checkFile(file);
    if ("issue" in result) {
      throw new CapsuleError(result.issue === "too_large" ? "file_too_large" : "file_unsupported");
    }
    return { file, kind: result.kind };
  });

  const id = createId("cap");
  const record: CapsuleRecord = {
    id,
    userId,
    title: input.title.trim().slice(0, MAX_TITLE),
    message: input.message.trim().slice(0, MAX_MESSAGE),
    unlockDate: input.unlockDate,
    createdAt: new Date(now).toISOString(),
  };
  store.saveCapsules([...store.capsules(), record]);

  const added: MediaRecord[] = [];
  for (const { file, kind } of checked) {
    const mediaId = createId("med");
    await putBlob(mediaId, file);
    added.push({ id: mediaId, capsuleId: id, userId, kind, mime: file.type, name: file.name });
  }
  store.saveMedia([...store.media(), ...added]);
  return id;
}

export async function deleteCapsule(userId: string, capsuleId: string): Promise<void> {
  const owned = store.media().filter((m) => m.capsuleId === capsuleId && m.userId === userId);
  await Promise.all(owned.map((m) => deleteBlob(m.id)));
  store.saveMedia(store.media().filter((m) => !owned.includes(m)));
  store.saveCapsules(store.capsules().filter((c) => !(c.id === capsuleId && c.userId === userId)));
}

export async function wipeBlobs(): Promise<void> {
  await clearBlobs();
}
