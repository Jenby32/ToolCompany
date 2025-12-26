"use client";

import { CookieBanner } from "./CookieBanner";
import { ToastProvider } from "@/context/ToastContext";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <CookieBanner />
    </ToastProvider>
  );
}
