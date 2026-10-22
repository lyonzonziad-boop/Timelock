import type { CapsuleView } from "@/types";

export function capsuleAsText(capsule: CapsuleView, dateLabel: string): string {
  return `${capsule.title}\n${dateLabel}\n\n${capsule.message ?? ""}\n`;
}

export function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function safeFilename(title: string): string {
  return (title || "capsule").replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 60) + ".txt";
}
