"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { PageHeader } from "@/components/shell";
import { CapsuleCard } from "@/components/capsule-card";
import { EmptyState, Segmented } from "@/components/ui";
import { filterCapsules } from "@/lib/capsules";
import type { CapsuleFilter, CapsuleSort } from "@/types";

export default function CapsulesPage() {
  const { t, capsules } = useApp();
  const [filter, setFilter] = useState<CapsuleFilter>("all");
  const [sort, setSort] = useState<CapsuleSort>("soon");
  const list = filterCapsules(capsules, filter, sort);

  return (
    <div className="cp-stack-lg">
      <PageHeader title={t.capsules.title} subtitle={t.capsules.subtitle} />

      <div className="cp-toolbar">
        <Segmented<CapsuleFilter>
          label={t.capsules.title}
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: t.capsules.all },
            { value: "locked", label: t.capsules.locked },
            { value: "open", label: t.capsules.open },
          ]}
        />
        <Segmented<CapsuleSort>
          label={t.capsules.soon}
          value={sort}
          onChange={setSort}
          options={[
            { value: "soon", label: t.capsules.soon },
            { value: "new", label: t.capsules.recent },
          ]}
        />
      </div>

      {capsules.length === 0 ? (
        <EmptyState
          title={t.dashboard.emptyTitle}
          text={t.capsules.empty}
          action={
            <Link href="/capsules/new" className="cp-btn cp-btn-primary">
              {t.capsules.create}
            </Link>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState title={t.capsules.title} text={t.capsules.emptyFilter} />
      ) : (
        <div className="cp-stack">
          {list.map((c) => (
            <CapsuleCard key={c.id} capsule={c} />
          ))}
        </div>
      )}
    </div>
  );
}
