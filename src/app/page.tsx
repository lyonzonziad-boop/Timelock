"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useApp } from "@/context/app-context";
import { AuthPanel } from "@/components/auth-panel";
import { LanguageToggle } from "@/components/language-toggle";
import { SupportBar } from "@/components/support-bar";

export default function HomePage() {
  const { t, ready, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  return (
    <div className="cp-landing">
      <header className="cp-landing-head">
        <div className="cp-brand">
          <span className="cp-logo">
            <Lock size={16} aria-hidden="true" />
          </span>
          {t.brand.name}
        </div>
        <LanguageToggle />
      </header>

      <main id="main" className="cp-landing-grid">
        <section className="cp-hero">
          <h1 className="cp-hero-title">{t.landing.title}</h1>
          <p className="cp-muted cp-hero-text">{t.landing.text}</p>
          <ol className="cp-steps">
            <li>{t.landing.step1}</li>
            <li>{t.landing.step2}</li>
            <li>{t.landing.step3}</li>
          </ol>
        </section>
        {ready && !user ? <AuthPanel /> : null}
      </main>

      <div className="cp-landing-foot">
        <SupportBar />
      </div>
    </div>
  );
}
