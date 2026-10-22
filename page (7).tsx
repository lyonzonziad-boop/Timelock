"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";

export default function PrivacyPage() {
  const { t } = useApp();
  return (
    <main className="cp-narrow cp-legal">
      <Link href="/" className="cp-back">
        ← {t.brand.name}
      </Link>
      <h1 className="cp-h1">{t.privacy.title}</h1>
      {t.privacy.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </main>
  );
}
