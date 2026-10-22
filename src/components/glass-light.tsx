"use client";

import { useEffect } from "react";

/** Le reflet des panneaux de verre suit le pointeur, calculé par rapport à chaque panneau. */
export function GlassLight() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".cp-glass") as HTMLElement | null | undefined;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ly", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
