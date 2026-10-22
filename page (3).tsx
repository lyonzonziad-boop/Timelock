"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { CapsuleCard } from "@/components/capsule-card";
import { EmptyState } from "@/components/ui";

export default function CapsuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, capsules, ready } = useApp();
  const capsule = capsules.find((c) => c.id === id);

  if (!ready) return null;

  return (
    <div className="cp-stack-lg cp-narrow">
      <Link href="/capsules" className="cp-back">
        ← {t.card.backToList}
      </Link>
      {capsule ? (
        <CapsuleCard capsule={capsule} />
      ) : (
        <EmptyState title={t.card.notFound} text={t.card.notFoundText} />
      )}
    </div>
  );
}
