"use client";

import { useState } from "react";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return !stored;
  });

  const decide = (value: "accepted" | "declined") => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur">
        <div className="flex flex-col gap-2 text-sm text-stone-800 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="text-base font-semibold text-stone-900">Cookies & Datenschutz</div>
            <p className="mt-1 text-stone-700">
              Wir nutzen notwendige Cookies für Login und Sicherheit. Du kannst zustimmen oder optionale
              Nachverfolgung ablehnen. In den Einstellungen kannst du das später ändern.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(16,185,129,0.28)]"
            >
              Akzeptieren
            </button>
            <button
              type="button"
              onClick={() => decide("declined")}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
            >
              Ablehnen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
