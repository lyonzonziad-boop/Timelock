"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Mic, Paperclip, Square, X } from "lucide-react";
import { useApp } from "@/context/app-context";
import { CapsuleError } from "@/lib/capsule-service";
import { addDays } from "@/lib/format";
import { checkFile, MAX_MESSAGE, MAX_TITLE } from "@/lib/validation";
import { createId } from "@/lib/id";
import { Button, Field, Input, Textarea } from "@/components/ui";
import type { MediaKind } from "@/types";

interface Attached {
  id: string;
  file: File;
  kind: MediaKind;
}

export function CapsuleForm() {
  const { t, create, notify } = useApp();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [files, setFiles] = useState<Attached[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const minDate = addDays(1);

  function addFiles(list: FileList | File[]) {
    const accepted: Attached[] = [];
    for (const file of Array.from(list)) {
      const result = checkFile(file);
      if ("issue" in result) {
        setError(t.errors[result.issue === "too_large" ? "file_too_large" : "file_unsupported"]);
        continue;
      }
      accepted.push({ id: createId("f"), file, kind: result.kind });
    }
    if (accepted.length) setFiles((prev) => [...prev, ...accepted]);
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        const file = new File([new Blob(chunksRef.current, { type })], `voice-${Date.now()}.${ext}`, { type });
        stream.getTracks().forEach((track) => track.stop());
        setFiles((prev) => [...prev, { id: createId("f"), file, kind: "audio" }]);
        setRecording(false);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError(t.errors.mic);
    }
  }

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await create({ title, message, unlockDate }, files.map((f) => f.file));
      notify(t.toast.created);
      router.push("/capsules");
    } catch (err) {
      setError(err instanceof CapsuleError ? t.errors[err.code] : t.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <form className="cp-glass cp-form" onSubmit={submit} onKeyDown={onKeyDown}>
      <Field label={t.form.titleLabel}>
        <Input
          value={title}
          maxLength={MAX_TITLE}
          placeholder={t.form.titlePlaceholder}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label={t.form.messageLabel} hint={`${message.length} / ${MAX_MESSAGE}`}>
        <Textarea
          value={message}
          maxLength={MAX_MESSAGE}
          placeholder={t.form.messagePlaceholder}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>

      <div className="cp-field">
        <span className="cp-label">{t.form.dateLabel}</span>
        <Input type="date" min={minDate} value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} />
        <div className="cp-quick">
          <Button type="button" variant="secondary" className="cp-btn-sm" onClick={() => setUnlockDate(addDays(7))}>
            {t.form.week}
          </Button>
          <Button type="button" variant="secondary" className="cp-btn-sm" onClick={() => setUnlockDate(addDays(30))}>
            {t.form.month}
          </Button>
          <Button type="button" variant="secondary" className="cp-btn-sm" onClick={() => setUnlockDate(addDays(365))}>
            {t.form.year}
          </Button>
        </div>
      </div>

      <label className="cp-drop">
        <Paperclip size={18} aria-hidden="true" />
        <span>{t.form.attach}</span>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="cp-sr"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <div className="cp-row">
        <Button type="button" variant="secondary" onClick={toggleRecording} aria-pressed={recording}>
          {recording ? <Square size={14} aria-hidden="true" /> : <Mic size={14} aria-hidden="true" />}
          {recording ? t.form.stop : t.form.record}
        </Button>
      </div>

      {files.length > 0 ? (
        <div className="cp-chips" aria-label={t.form.attached}>
          {files.map((f) => (
            <span className="cp-chip" key={f.id}>
              {f.file.name}
              <button
                type="button"
                aria-label={`${t.form.remove} ${f.file.name}`}
                onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
              >
                <X size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="cp-err" role="alert">
        {error}
      </div>

      <div className="cp-row cp-row-end">
        <span className="cp-hint">{t.form.shortcut}</span>
        <Button type="submit" disabled={busy}>
          {t.form.submit}
        </Button>
      </div>
    </form>
  );
}

