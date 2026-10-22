"use client";

import { useApp } from "@/context/app-context";

const BASE = "https://www.paypal.com/paypalme/NatanBoncompain543";

export function SupportBar() {
  const { t } = useApp();
  return (
    <section className="cp-glass cp-support" aria-label="Support">
      <p className="cp-muted cp-small">{t.support.text}</p>
      <div className="cp-row">
        <a className="cp-btn cp-btn-secondary cp-btn-sm" href={`${BASE}/1EUR`} target="_blank" rel="noopener noreferrer">
          {t.support.one}
        </a>
        <a className="cp-btn cp-btn-secondary cp-btn-sm" href={`${BASE}/3EUR`} target="_blank" rel="noopener noreferrer">
          {t.support.three}
        </a>
        <a className="cp-btn cp-btn-primary cp-btn-sm" href={`${BASE}/5EUR`} target="_blank" rel="noopener noreferrer">
          {t.support.five}
        </a>
      </div>
    </section>
  );
}
