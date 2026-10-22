import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/context/app-context";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "TimeLock — Write today. Open later.",
    template: "%s · TimeLock",
  },
  description:
    "Sealed messages, photos, videos and voice notes that open on the day you choose. Stored on your device.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <a className="cp-skip" href="#main">
          Aller au contenu
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
