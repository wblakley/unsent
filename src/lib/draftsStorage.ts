// src/lib/draftsStorage.ts
export type Draft = {
    id: string;
    title: string;
    body: string;
    updatedAt: number;
  };
  
  const DRAFTS_KEY = "unsent_drafts_v1";
  
  export function loadDrafts(): Draft[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(DRAFTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Draft[]) : [];
    } catch {
      return [];
    }
  }
  
  export function saveDraft(draft: Draft): void {
    if (typeof window === "undefined") return;
    const drafts = loadDrafts();
    const next = [draft, ...drafts.filter((d) => d.id !== draft.id)];
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
  }
  
  export function loadDraftById(id: string): Draft | null {
    const drafts = loadDrafts();
    return drafts.find((d) => d.id === id) ?? null;
  }
  
  export function latestDraft(): Draft | null {
    const drafts = loadDrafts();
    return drafts.length ? drafts[0] : null;
  }
  