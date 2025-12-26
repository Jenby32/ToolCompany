"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useContentData } from "@/hooks/useContentData";

type UiBranch = {
  name: string;
  summary: string;
  tools: string[];
};

const copy = {
  badge: "Bereiche",
  title: "Bereichs-Übersicht",
  body: "Kombiniere Bereiche und tausche später echte Daten ein, wenn du jede Linie verdrahtest.",
  viewTools: "Tools ansehen",
  back: "Zurück",
};

export default function BranchesPage() {
  const { data } = useContentData();
  const branches =
    data?.branches?.map((b) => ({
      name: b.name,
      summary: b.summary,
      tools: [],
    })) ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16 md:px-10 md:py-20">
      <NavBarSimple />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-700/80">{copy.badge}</p>
          <h1 className="text-4xl font-semibold text-stone-900">{copy.title}</h1>
          <p className="text-stone-700">{copy.body}</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
        >
          {copy.back}
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {branches.map((branch, idx) => (
          <motion.div
            key={branch.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            viewport={{ once: true }}
            className="glass relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-emerald-100 opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80">
                Bereich
              </div>
              <h3 className="text-2xl font-semibold text-stone-900">{branch.name}</h3>
              <p className="text-stone-700">{branch.summary}</p>
              <div className="flex flex-wrap gap-2 pt-2 text-xs">
                {branch.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-stone-100 px-3 py-1 text-stone-800">
                    {tool}
                  </span>
                ))}
              </div>
              <Link
                href="/tools"
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(16,185,129,0.25)]"
              >
                {copy.viewTools}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
