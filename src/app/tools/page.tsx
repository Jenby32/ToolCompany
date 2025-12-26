"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useContentData } from "@/hooks/useContentData";

type UiTool = {
  id?: number;
  title: string;
  branch: string;
  description: string;
  status: "Aktiv" | "In Prüfung" | "Entwurf";
  tags: string[];
  previewUrl?: string | null;
  videoUrl?: string | null;
};

const copy = {
  badge: "Tools",
  title: "Demo-Tools",
  body: "Karten sind bereit für echte Daten oder Live-Demos. Mit Hover heben sie sich ab, ein Klick führt zur Demo oder zum Kontakt.",
  back: "Zurück",
  cta: "Demo öffnen",
};

function normalizeStatus(status?: string | null): UiTool["status"] {
  if (status === "In Prüfung" || status === "Entwurf") return status;
  return "Aktiv";
}

export default function ToolsPage() {
  const { data } = useContentData();
  const branchNameById = new Map((data?.branches ?? []).map((b) => [b.id, b.name]));
  const tools =
    data?.tools?.map((tool, idx) => ({
      id: tool.id ?? idx,
      title: tool.title,
      branch: tool.branchId ? branchNameById.get(tool.branchId) ?? "Nicht zugeordnet" : "Nicht zugeordnet",
      description: tool.description,
      status: normalizeStatus(tool.status),
      tags: tool.tags ?? [],
      previewUrl: tool.previewUrl,
      videoUrl: tool.videoUrl,
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
        {tools.map((tool, idx) => (
          <motion.div
            key={tool.id ?? tool.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-transparent to-amber-100 opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {tool.branch}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tool.status === "Aktiv"
                      ? "bg-emerald-100 text-emerald-800"
                      : tool.status === "In Prüfung"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-700"
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">{tool.title}</h3>
              <p className="text-sm text-stone-600">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={tool.id != null ? `/tools/${tool.id}` : "/contact"}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
                >
                  Details
                </Link>
                {tool.previewUrl && (
                  <a
                    href={tool.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-3 py-2 text-xs font-semibold text-stone-900 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(16,185,129,0.25)]"
                  >
                    Demo
                  </a>
                )}
                {tool.videoUrl && (
                  <a
                    href={tool.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
                  >
                    Video
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
