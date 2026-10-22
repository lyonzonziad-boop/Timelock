"use client";

import Link from "next/link";
import { useApp } from "@/context/app-context";
import { PageHeader } from "@/components/shell";
import { Countdown } from "@/components/countdown";
import { CapsuleCard } from "@/components/capsule-card";
import { EmptyState } from "@/components/ui";

export default function DashboardPage() {
  const { t, stats, nextLocked, capsules } = useApp();
  const recent = capsules.slice(0, 3);

  return (
    <div className="cp-stack-lg">
      <PageHeader
        title={t.dashboard.title}
        subtitle={t.dashboard.subtitle}
        actions={
          <Link href="/capsules/new" className="cp-btn cp-btn-primary">
            {t.dashboard.create}
          </Link>
        }
      />

      <div className="cp-stats">
        <article className="cp-glass cp-stat">
          <span className="cp-muted cp-small">{t.dashboard.total}</span>
          <b>{stats.total}</b>
        </article>
        <article className="cp-glass cp-stat">
          <span className="cp-muted cp-small">{t.dashboard.opened}</span>
          <b>{stats.opened}</b>
        </article>
        <article className="cp-glass cp-stat">
          <span className="cp-muted cp-small">{t.dashboard.streak}</span>
          <b>{stats.streak}</b>
        </article>
        <article className="cp-glass cp-stat">
          <span className="cp-muted cp-small">
            {t.dashboard.level} {stats.level} · {Math.floor(stats.xp)} {t.dashboard.xp}
          </span>
          <div className="cp-bar" aria-hidden="true">
            <i style={{ width: `${Math.round(stats.levelProgress * 100)}%` }} />
          </div>
        </article>
      </div>

      <section className="cp-glass cp-panel">
        <h2 className="cp-h2">{t.dashboard.next}</h2>
        {nextLocked ? (
          <>
            <p className="cp-card-title">{nextLocked.title || t.card.untitled}</p>
            <Countdown unlockDate={nextLocked.unlockDate} createdAt={nextLocked.createdAt} />
          </>
        ) : (
          <p className="cp-muted">{t.dashboard.nextNone}</p>
        )}
      </section>

      <section className="cp-stack">
        <div className="cp-page-head">
          <h2 className="cp-h2">{t.dashboard.recent}</h2>
          {capsules.length > 0 ? (
            <Link href="/capsules" className="cp-back">
              {t.dashboard.viewAll}
            </Link>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title={t.dashboard.emptyTitle}
            text={t.dashboard.emptyText}
            action={
              <Link href="/capsules/new" className="cp-btn cp-btn-primary">
                {t.dashboard.create}
              </Link>
            }
          />
        ) : (
          recent.map((c) => <CapsuleCard key={c.id} capsule={c} />)
        )}
      </section>
    </div>
  );
}
