"use client";

import { useApp } from "@/context/app-context";

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="cp-glass cp-toast" role="status">
      {toast}
    </div>
  );
}
