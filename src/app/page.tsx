"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useContentData } from "@/hooks/useContentData";

type ToolCard = {
  id?: number;
  title: string;
  branch: string;
  description: string;
  status: "Aktiv" | "In Prüfung" | "Entwurf";
  tags: string[];
  previewUrl?: string | null;
  videoUrl?: string | null;
};

type BranchCard = {
  name: string;
  summary: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function normalizeStatus(status?: string | null): ToolCard["status"] {
  if (status === "In Prüfung" || status === "Entwurf") return status;
  return "Aktiv";
}

const copy = {
  heroTitle: "Wir bauen moderne Tools und Software für Ihr Business.",
  heroSub:
    "Individuelle Plattformen, Dashboards und Workflows. Von der Idee bis zum Launch liefern wir klares UX, verlässliche Backend-Systeme und schnelle Iterationen.",
  ctaWhat: "Was wir bauen",
  ctaConsult: "Kostenlos beraten lassen",
  ctaExamples: "Beispiele ansehen",
  capabilitiesBadge: "Fähigkeiten",
  capabilitiesTitle: "Branchen und Bereiche",
  capabilitiesBody:
    "Wir bauen Tools, Dashboards und Workflows für Ihren Bereich. Das sind typische Felder.",
  examplesBadge: "Was wir liefern",
  examplesTitle: "Beispiele unserer Arbeit",
  examplesBody:
    "Beispiel-Tools und Prototypen zeigen unser Handwerk. Jede Umsetzung passt zu Ihrer Marke, Daten und Prozessen.",
  whyBadge: "Warum ToolCompany",
  whyTitle: "Darum wir",
  whyBody: "Klares Produktdenken, schnelle Lieferung und solide Technik.",
  processBadge: "Ablauf",
  processTitle: "So arbeiten wir",
  processBody:
    "Vom Briefing bis zum Launch halten wir Sie mit Voransichten, Demos und klaren Meilensteinen im Loop.",
  processSteps: [
    { title: "Discovery", body: "Ziele, Nutzer, Erfolgskriterien klären." },
    { title: "Design & Prototyp", body: "Skizzen und klickbare Demos für schnelle Abstimmung." },
    { title: "Bauen & Testen", body: "Iterative Auslieferungen mit Qualitätsprüfung und Monitoring." },
    { title: "Launch & Support", body: "Ausrollen, monitoren und weiterentwickeln." },
  ],
  valueProps: [
    {
      title: "Sauberes UI/UX",
      body: "Polierte Oberflächen, schnell zu verstehen und angenehm zu bedienen.",
    },
    { title: "Schnelle Lieferung", body: "Kurze Build-Zyklen mit Previews und Demos." },
    { title: "Admin & CMS", body: "Dashboards für Inhalte, Tools und Kunden." },
    { title: "Skalierbares Backend", body: "API-zentriert auf verlässlicher MySQL-Basis." },
    { title: "Klare Kommunikation", body: "Transparente Roadmaps und feste Ansprechpartner." },
    { title: "Branchenübergreifend", body: "Erfahrung in Immobilien, Dienstleistungen, Handel und mehr." },
  ],
  contactTitle: "Lassen Sie uns Ihr nächstes Tool bauen.",
  contactBody:
    "Erzählen Sie uns von Plattform, Dashboard oder Workflow. Wir melden uns schnell mit Plan und Demo-Pfad. Jetzt kostenloses Beratungsgespräch sichern.",
  contactPrimary: "Kostenlos beraten lassen",
  contactSecondary: "Beispiele ansehen",
  details: "Details",
  demo: "Demo",
  video: "Video",
  heroHighlights: [
    { label: "Individuelle Dashboards", value: "Admin, Analysen, Betrieb" },
    { label: "Schnelle Iterationen", value: "Wöchentliche Updates" },
    { label: "Markengerecht", value: "CI-konforme Oberflächen" },
    { label: "Backend", value: "MySQL + Schnittstellen" },
  ],
};

export default function Home() {
  const { data: contentData, loading, error } = useContentData();

  const branchesForUi: BranchCard[] =
    contentData?.branches?.map((b) => ({
      name: b.name,
      summary: b.summary,
    })) ?? [];

  const branchNameById = useMemo(
    () => new Map((contentData?.branches ?? []).map((b) => [b.id, b.name])),
    [contentData?.branches],
  );

  const toolsForUi: ToolCard[] =
    contentData?.tools?.map((tool, idx) => ({
      id: tool.id ?? idx,
      title: tool.title,
      branch: tool.branchId ? branchNameById.get(tool.branchId) ?? "Nicht zugeordnet" : "Nicht zugeordnet",
      description: tool.description,
      status: normalizeStatus(tool.status),
      tags: tool.tags ?? [],
      previewUrl: tool.previewUrl,
      videoUrl: tool.videoUrl,
    })) ?? [];

  const contactsForUi = contentData?.contacts ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 md:px-10 md:py-20">
      <NavBarSimple />

      <Hero copy={copy} />

      <SectionShell
        id="branches"
        badge={copy.capabilitiesBadge}
        title={copy.capabilitiesTitle}
        body={copy.capabilitiesBody}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branchesForUi.map((branch, idx) => (
            <motion.div
              key={branch.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-amber-50 opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {branch.name}
                </span>
                <p className="text-sm text-stone-700">{branch.summary}</p>
                <div className="flex gap-2 text-xs text-stone-600">
                  <span className="rounded-full bg-emerald-50 px-3 py-1">Individuell</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">Schnittstellen</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="examples"
        badge={copy.examplesBadge}
        title={copy.examplesTitle}
        body={copy.examplesBody}
      >
        <ToolsShowcase tools={toolsForUi} copy={copy} />
      </SectionShell>

      <SectionShell id="value" badge={copy.whyBadge} title={copy.whyTitle} body={copy.whyBody}>
        <div className="grid gap-4 md:grid-cols-2">
          {copy.valueProps.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-sm font-semibold text-stone-900">{item.title}</div>
              <p className="mt-1 text-sm text-stone-700">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="process"
        badge={copy.processBadge}
        title={copy.processTitle}
        body={copy.processBody}
      >
        <div className="grid gap-4 md:grid-cols-4">
          {copy.processSteps.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80">
                Schritt {idx + 1}
              </div>
              <div className="mt-2 text-sm font-semibold text-stone-900">{step.title}</div>
              <p className="text-sm text-stone-700">{step.body}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <ContactCTA contacts={contactsForUi} loading={loading} error={error} copy={copy} />
    </main>
  );
}

function Hero({ copy }: { copy: typeof copy }) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-emerald-50/70 via-white/30 to-amber-50/70 p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      id="overview"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,164,140,0.12),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(236,180,120,0.1),transparent_38%)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr,1fr]">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-emerald-700/80">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            ToolCompany
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">{copy.heroTitle}</h1>
          <p className="max-w-2xl text-lg text-stone-700">{copy.heroSub}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#examples"
              className="rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-5 py-3 text-sm font-semibold text-stone-900 shadow-[0_15px_35px_rgba(16,185,129,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(16,185,129,0.28)]"
            >
              {copy.ctaWhat}
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:-translate-y-1 hover:shadow-sm"
            >
              {copy.ctaConsult}
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:-translate-y-1 hover:shadow-sm"
            >
              {copy.ctaExamples}
            </Link>
          </div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass relative rounded-3xl p-6"
        >
          <div className="flex items-center justify-between text-sm text-stone-500">
            <span className="flex items-center gap-2 font-semibold text-stone-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live-Vorschau
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Bereit</span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-stone-700">
            {copy.heroHighlights.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="font-semibold text-stone-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionShell({
  id,
  badge,
  title,
  body,
  children,
}: {
  id?: string;
  badge: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="glass rounded-3xl p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80">{badge}</span>
          <h2 className="text-3xl font-semibold text-stone-900">{title}</h2>
          <p className="text-sm text-stone-700">{body}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ToolsShowcase({
  tools,
  copy,
}: {
  tools: ToolCard[];
  copy: typeof copy;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, idx) => (
        <motion.div
          key={tool.id ?? tool.title}
          className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.35 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-transparent to-amber-100" />
          </div>
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
                {copy.details}
              </Link>
              {tool.previewUrl && (
                <a
                  href={tool.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-3 py-2 text-xs font-semibold text-stone-900 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(16,185,129,0.25)]"
                >
                  {copy.demo}
                </a>
              )}
              {tool.videoUrl && (
                <a
                  href={tool.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
                >
                  {copy.video}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ContactCTA({
  contacts,
  loading,
  error,
  copy,
}: {
  contacts: { id: number; label: string; value: string; kind: string }[] | null;
  loading: boolean;
  error: string | null;
  copy: typeof copy;
}) {
  const contactsToShow = contacts ?? [];

  return (
    <section
      id="contact"
      className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
    >
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/80">Kontakt</span>
        <h3 className="text-3xl font-semibold text-stone-900">{copy.contactTitle}</h3>
        <p className="text-sm text-stone-700">{copy.contactBody}</p>
        {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">{error}</div>}
        <div className="flex flex-wrap gap-2 text-sm text-stone-800">
          {contactsToShow.map((c) => {
            const href =
              c.kind === "email" ? `mailto:${c.value}` : c.kind === "phone" ? `tel:${c.value}` : c.value;
            return (
              <a
                key={c.id}
                className="rounded-full border border-stone-200 px-4 py-2 hover:border-stone-300"
                href={href}
              >
                {c.label}: {c.value}
              </a>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-5 py-3 text-sm font-semibold text-stone-900 shadow-[0_15px_35px_rgba(16,185,129,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(16,185,129,0.28)]"
          >
            {copy.contactPrimary}
          </Link>
          <Link
            href="/tools"
            className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-300 hover:-translate-y-1 hover:shadow-sm"
          >
            {copy.contactSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
