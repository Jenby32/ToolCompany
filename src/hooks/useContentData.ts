"use client";

import { useEffect, useState } from "react";
import type { ContentResponse } from "@/lib/content-types";

type ContentState = {
  data: ContentResponse | null;
  loading: boolean;
  error: string | null;
};

export function useContentData() {
  const [state, setState] = useState<ContentState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error(`Inhalte konnten nicht geladen werden: ${res.statusText}`);
        const json = (await res.json()) as ContentResponse;
        if (!active) return;
        setState({ data: json, loading: false, error: null });
      } catch (err) {
        if (!active) return;
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Unbekannter Fehler",
        });
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
