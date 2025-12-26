"use client";

import { useEffect, useState } from "react";

type Session = {
  sub: string;
  role: "admin" | "member" | "customer";
} | null;

type SessionState = {
  session: Session;
  loading: boolean;
};

export function useSession() {
  const [state, setState] = useState<SessionState>({ session: null, loading: true });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          if (active) setState({ session: null, loading: false });
          return;
        }
        const json = (await res.json()) as Session;
        if (active) setState({ session: json, loading: false });
      } catch {
        if (active) setState({ session: null, loading: false });
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
