"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Inbox, Lock, LayoutDashboard, LogOut, PenLine, Settings } from "lucide-react";
import { useApp } from "@/context/app-context";
import { Ceremony } from "@/components/ceremony";
import { SupportBar } from "@/components/support-bar";
import { Toast } from "@/components/toast";

const LINKS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/capsules", key: "capsules", icon: Inbox },
  { href: "/capsules/new", key: "compose", icon: PenLine },
  { href: "/settings", key: "settings", icon: Settings },
] as const;

function isActive(href: string, pathname: string): boolean {
  if (href === "/capsules") return pathname === "/capsules" || (pathname.startsWith("/capsules/") && pathname !== "/capsules/new");
  return pathname === href;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, ready, user, signOut } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="cp-center">
        <p className="cp-muted">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="cp-shell">
      <aside className="cp-sidebar cp-glass">
        <Link href="/dashboard" className="cp-brand">
          <span className="cp-logo">
            <Lock size={16} aria-hidden="true" />
          </span>
          {t.brand.name}
        </Link>
        <nav className="cp-nav" aria-label={t.common.menu}>
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="cp-nav-link"
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="cp-nav-link" onClick={() => signOut()}>
          <LogOut size={18} aria-hidden="true" />
          {t.nav.signOut}
        </button>
      </aside>
      <div className="cp-main">
        <main id="main" className="cp-content">
          {children}
        </main>
        <SupportBar />
      </div>
      <Ceremony />
      <Toast />
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="cp-page-head">
      <div>
        <h1 className="cp-h1">{title}</h1>
        {subtitle ? <p className="cp-muted">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
