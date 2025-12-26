"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useContentData } from "@/hooks/useContentData";

function normalizeStatus(status?: string | null): "Aktiv" | "In Prüfung" | "Entwurf" {
  if (status === "In Prüfung" || status === "Entwurf") return status;
  return "Aktiv";
}

const copy = {
  notFoundTitle: "Tool nicht gefunden",
  notFoundBody: "Vielleicht wurde es entfernt oder der Link ist veraltet.",
  back: "Zurück zu Tools",
  statusDemo: "Demo bereit",
  statusVideo: "Video",
  contact: "Kontakt aufnehmen",
  demo: "Live-Demo",
  video: "Video ansehen",
  quickFacts: "Kurzinfo",
  statusLabel: "Status",
  branchLabel: "Bereich",
  idLabel: "ID",
  loading: "Lädt...",
};

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, loading, error } = useContentData();
  const toolId = Number(params?.id);

  const tool = data?.tools.find((t) => t.id === toolId);
  const branchName = tool && data ? data.branches.find((b) => b.id === tool.branchId)?.name : undefined;
  const status = tool ? normalizeStatus(tool.status) : null;

  useEffect(() => {
    if (!loading && (!toolId || Number.isNaN(toolId))) {
      router.push("/tools");
    }
  }, [loading, router, toolId]);

  const tags = tool?.tags ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16 md:px-10 md:py-20">
      <NavBarSimple />
      {loading && <div className="text-sm text-stone-600">{copy.loading}</div>}
      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">{error}</div>}
      {!tool && !loading && (
        <div className="rounded-3xl border border-stone-200 bg-white p-8">
          <h1 className="text-2xl font-semibold text-stone-900">{copy.notFoundTitle}</h1>
          <p className="mt-2 text-sm text-stone-700">{copy.notFoundBody}</p>
          <Link
            href="/tools"
            className="mt-4 inline-flex rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
          >
            {copy.back}
          </Link>
        </div>
      )}

      {tool && (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="glass relative overflow-hidden rounded-3xl p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-amber-50" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {status ?? ""}
                </span>
                {branchName && (
                  <span className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-700">
                    {branchName}
                  </span>
                )}
                {tool.previewUrl && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                    {copy.statusDemo}
                  </span>
                )}
                {tool.videoUrl && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
                    {copy.statusVideo}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-semibold text-stone-900">{tool.title}</h1>
              <p className="text-base text-stone-700">{tool.description}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(16,185,129,0.25)]"
                >
                  {copy.contact}
                </Link>
                {tool.previewUrl && (
                  <a
                    href={tool.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
                  >
                    {copy.demo}
                  </a>
                )}
                {tool.videoUrl && (
                  <a
                    href={tool.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-800 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
                  >
                    {copy.video}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-stone-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-stone-900">{copy.quickFacts}</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>
                  - {copy.statusLabel}: {status ?? ""}
                </li>
                <li>
                  - {copy.branchLabel}: {branchName ?? "Nicht zugeordnet"}
                </li>
                <li>
                  - {copy.idLabel}: {tool.id}
                </li>
              </ul>
            </motion.div>
            {tool.previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6"
              >
                <div className="text-sm font-semibold text-emerald-900">Demo-URL</div>
                <a
                  href={tool.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm text-emerald-800 underline"
                >
                  {tool.previewUrl}
                </a>
              </motion.div>
            )}
            {tool.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6"
              >
                <div className="text-sm font-semibold text-indigo-900">Video</div>
                <a
                  href={tool.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm text-indigo-800 underline"
                >
                  {tool.videoUrl}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
