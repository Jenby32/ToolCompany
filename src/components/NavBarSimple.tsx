"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { id: "overview", href: "/" },
  { id: "branches", href: "/branches" },
  { id: "tools", href: "/tools" },
  { id: "contact", href: "/contact" },
];

const labels = {
  overview: "Überblick",
  branches: "Bereiche",
  tools: "Werkzeuge",
  contact: "Kontakt",
  view: "Zur Übersicht",
  book: "Demo buchen",
  profile: "Profil",
  admin: "Admin",
  login: "Anmelden",
  register: "Registrieren",
  logout: "Abmelden",
};

export function NavBarSimple() {
  const navLinkBase =
    "relative inline-flex items-center gap-2 rounded-full px-3 py-2 transition duration-200";
  const menuItemBase =
    "flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-left text-sm text-stone-700 hover:bg-emerald-50 hover:text-stone-900";

  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ sub: string; role: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isAdmin = session?.role === "admin";

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          if (mounted) setSession(null);
          return;
        }
        const json = await res.json();
        if (mounted) setSession(json);
      } catch {
        if (mounted) setSession(null);
      }
    };
    loadSession();
    return () => {
      mounted = false;
    };
  }, []);

  const authedLinks = session
    ? [{ href: "/profile", label: labels.profile }]
    : [
        { href: "/login", label: labels.login },
        { href: "/register", label: labels.register },
      ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setLoggingOut(false);
    setOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="sticky top-0 z-30 mb-10 rounded-2xl border border-stone-200 bg-white/90 px-5 py-4 shadow-[0_12px_35px_rgba(15,23,42,0.08)] backdrop-blur md:rounded-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200 to-amber-200 text-stone-900 font-semibold">
            TC
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-stone-900">ToolCompany</span>
            <span className="text-xs font-medium text-stone-600">Portfolio Plattform</span>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-between gap-6 text-sm text-stone-700 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${navLinkBase} px-3 py-1.5 text-sm hover:-translate-y-0.5 hover:text-stone-900 hover:bg-emerald-50`}
              >
                {labels[item.id as keyof typeof labels]}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(16,185,129,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-[0_14px_28px_rgba(16,185,129,0.22)]"
            >
              {labels.book}
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span>{session ? labels.profile : labels.login}</span>
                <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                {isAdmin && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Admin
                  </span>
                )}
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-stone-200 bg-white p-3 shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                  {session ? (
                    <div className="flex flex-col gap-2">
                      <Link href="/profile" className={menuItemBase} onClick={() => setAccountOpen(false)}>
                        <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {labels.profile}
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className={menuItemBase} onClick={() => setAccountOpen(false)}>
                          <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <path d="M3 9h18M9 21V9" />
                          </svg>
                          {labels.admin}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          handleLogout();
                        }}
                        disabled={loggingOut}
                        className={menuItemBase}
                      >
                        <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {loggingOut ? "..." : labels.logout}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" className={menuItemBase} onClick={() => setAccountOpen(false)}>
                        <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v4" />
                          <polyline points="10 14 21 3" />
                          <rect x="3" y="11" width="11" height="10" rx="2" ry="2" />
                        </svg>
                        {labels.login}
                      </Link>
                      <Link href="/register" className={menuItemBase} onClick={() => setAccountOpen(false)}>
                        <svg className="h-4 w-4 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Z" />
                          <path d="M19 21v-2a4 4 0 0 0-4-4h-1" />
                          <path d="M7 21v-2a4 4 0 0 1 4-4h1" />
                        </svg>
                        {labels.register}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Navigation umschalten"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-stone-700" />
            <span className="block h-0.5 w-4 rounded-full bg-stone-700" />
            <span className="block h-0.5 w-6 rounded-full bg-stone-700" />
          </div>
        </button>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-800 shadow-[0_12px_30px_rgba(15,23,42,0.12)] md:hidden">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-full px-3 py-2 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                {labels[item.id as keyof typeof labels]}
              </Link>
            ))}
            {authedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-full border border-stone-200 px-3 py-2 hover:bg-emerald-50"
              >
                {loggingOut ? "..." : labels.logout}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-full bg-stone-900 px-3 py-2 text-white shadow-[0_8px_18px_rgba(15,23,42,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.25)]"
                onClick={() => setOpen(false)}
              >
                {labels.admin}
              </Link>
            )}
            <Link
              href="/"
              className="rounded-full border border-stone-200 px-3 py-2 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
              onClick={() => setOpen(false)}
            >
              {labels.view}
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-3 py-2 font-semibold text-stone-900 shadow-[0_8px_18px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(16,185,129,0.25)]"
              onClick={() => setOpen(false)}
            >
              {labels.book}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
