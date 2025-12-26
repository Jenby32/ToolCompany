"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useToast } from "@/context/ToastContext";

const copy = {
  title: "Anmelden",
  email: "E-Mail",
  password: "Passwort",
  submit: "Anmelden",
  submitting: "Melde an...",
  noAccount: "Noch kein Konto?",
  register: "Registrieren",
  forgot: "Passwort vergessen?",
  guest: "Weiter als Gast",
  errorGeneric: "Anmeldung fehlgeschlagen",
  success: "Anmeldung erfolgreich",
};

export default function LoginPage() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        const text = msg.error ?? copy.errorGeneric;
        setError(text);
        setLoading(false);
        toast?.addToast({ type: "error", text });
        return;
      }
      toast?.addToast({ type: "success", text: copy.success });
      router.push("/");
    } catch (err) {
      const text = err instanceof Error ? err.message : copy.errorGeneric;
      setError(text);
      toast?.addToast({ type: "error", text });
      setLoading(false);
    }
  };

  if (!sessionLoading && session) {
    router.push(session.role === "admin" ? "/admin" : "/");
  }

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
        <Link href="/reset" className="text-sm text-emerald-700 hover:text-emerald-800">
          {copy.forgot}
        </Link>
      </div>
      <div className="glass rounded-3xl p-6">
        <h1 className="text-3xl font-semibold text-stone-900">{copy.title}</h1>
        <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
          <label className="flex flex-col gap-1 text-sm text-stone-700">
            {copy.email}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-stone-700">
            {copy.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
              required
            />
          </label>
          {error && <div className="text-sm text-amber-700">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(16,185,129,0.28)] disabled:opacity-60"
          >
            {loading ? copy.submitting : copy.submit}
          </button>
        </form>
        <div className="mt-4 text-sm text-stone-700">
          {copy.noAccount}{" "}
          <a href="/register" className="text-emerald-700 hover:text-emerald-800">
            {copy.register}
          </a>
        </div>
        <div className="mt-3 text-sm">
          <Link href="/" className="text-emerald-700 hover:text-emerald-800">
            {copy.guest}
          </Link>
        </div>
      </div>
    </main>
  );
}
