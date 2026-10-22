"use client";

import { useEffect } from "react";

const HOVER_SELECTOR = "a, button, input, textarea, select, label, [role='button'], [tabindex]";

const SVG = `
  <svg viewBox="0 0 28 28" fill="none" stroke-linecap="round">
    <g class="ring">
      <circle cx="14" cy="14" r="11" stroke="#000" stroke-width="3" opacity=".55"/>
      <circle cx="14" cy="14" r="11" stroke="#fff" stroke-width="1.2"/>
    </g>
    <g class="ticks">
      <path d="M14 2.5V9.5M14 18.5V25.5M2.5 14H9.5M18.5 14H25.5" stroke="#000" stroke-width="3.4" opacity=".55"/>
      <path d="M14 2.5V9.5M14 18.5V25.5M2.5 14H9.5M18.5 14H25.5" stroke="#fff" stroke-width="1.5"/>
    </g>
    <circle cx="14" cy="14" r="1.7" fill="#fff" stroke="#000" stroke-width="1"/>
  </svg>`;

/** Viseur noir et blanc qui remplace le curseur. Actif uniquement avec une souris. */
export function Crosshair() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xh = document.createElement("div");
    xh.className = "xhair";
    xh.setAttribute("aria-hidden", "true");
    xh.innerHTML = SVG;
    document.body.appendChild(xh);

    let x = 0;
    let y = 0;
    let frame = 0;
    const paint = () => {
      xh.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      document.documentElement.classList.add("xh");
      xh.classList.add("on");
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
      const target = e.target as Element | null;
      xh.classList.toggle("hover", !!target?.closest?.(HOVER_SELECTOR));
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") xh.classList.add("down");
    };
    const onUp = () => xh.classList.remove("down");
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) xh.classList.remove("on");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("xh");
      xh.remove();
    };
  }, []);

  return null;
}
