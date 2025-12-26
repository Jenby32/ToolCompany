"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";

// Disable static prerendering so search params are available at runtime
export const dynamic = "force-dynamic";

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetPageContent />
    </Suspense>
  );
}

function ResetPageContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error ?? "E-Mail konnte nicht versendet werden");
      }

      setMessage("Wenn die Adresse existiert, senden wir gleich Anweisungen.");
      toast?.addToast({ type: "success", text: "Prüfe dein Postfach für den Link" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "E-Mail konnte nicht versendet werden";
      setError(msg);
      toast?.addToast({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error ?? "Passwort konnte nicht gesetzt werden");
      }

      setMessage("Passwort aktualisiert. Du kannst dich jetzt mit dem neuen Passwort anmelden.");
      toast?.addToast({ type: "success", text: "Passwort aktualisiert" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Passwort konnte nicht gesetzt werden";
      setError(msg);
      toast?.addToast({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-6 py-16 md:px-10 md:py-20">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200 to-amber-200 text-stone-900 font-semibold">
            TC
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-stone-800">ToolCompany</span>
            <span className="text-xs text-stone-500">Portfolio Plattform</span>
          </div>
        </Link>
        <Link href="/login" className="text-sm text-emerald-700 hover:text-emerald-800">
          Zurück zum Login
        </Link>
      </div>

      <div className="glass rounded-3xl p-6">
        <h1 className="text-3xl font-semibold text-stone-900">
          {token ? "Neues Passwort setzen" : "Passwort zurücksetzen"}
        </h1>

        {!token && (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleRequest}>
            <label className="flex flex-col gap-1 text-sm text-stone-700">
              E-Mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
                required
              />
            </label>

            {error && <div className="text-sm text-amber-700">{error}</div>}
            {message && <div className="text-sm text-emerald-700">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(16,185,129,0.28)] disabled:opacity-60"
            >
              {loading ? "Sende..." : "Link zum Zurücksetzen senden"}
            </button>
          </form>
        )}

        {token && (
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleReset}>
            <label className="flex flex-col gap-1 text-sm text-stone-700">
              Neues Passwort
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
                minLength={8}
                maxLength={128}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-stone-700">
              Passwort bestätigen
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
                minLength={8}
                maxLength={128}
                required
              />
            </label>

            {error && <div className="text-sm text-amber-700">{error}</div>}
            {message && <div className="text-sm text-emerald-700">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(16,185,129,0.28)] disabled:opacity-60"
            >
              {loading ? "Aktualisiere..." : "Passwort speichern"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
