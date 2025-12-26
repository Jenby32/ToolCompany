"use client";

import Link from "next/link";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useContentData } from "@/hooks/useContentData";

export default function ContactPage() {
  const { data } = useContentData();

  const contacts = data?.contacts ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16 md:px-10 md:py-20">
      <NavBarSimple />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80">Kontakt</p>
          <h1 className="text-4xl font-semibold text-stone-900">Melde dich</h1>
          <p className="text-stone-700">
            Tausche die Links oder binde dein Wunsch-Formular ein. Buttons führen hierher.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
        >
          Zurück
        </Link>
      </div>

      <div className="glass rounded-3xl p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold text-stone-900">Erreichbarkeit</h3>
          <p className="text-sm text-stone-700">
            Nutze die Links oder ersetze den Block durch deinen bevorzugten Form-Anbieter.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-stone-800">
            {contacts.map((c) => {
              const href =
                c.kind === "email" ? `mailto:${c.value}` : c.kind === "phone" ? `tel:${c.value}` : c.value;
              return (
                <a
                  key={c.id}
                  className="rounded-full border border-stone-200 px-4 py-2 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
                  href={href}
                >
                  {c.label}: {c.value}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
