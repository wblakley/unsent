"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LetterRow = {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  status: string | null;
  created_at: string;
  // if you add updated_at later, it will be optional
  updated_at?: string | null;
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function snippet(text: string | null, max = 80) {
  const t = (text ?? "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function LettersPage() {
  const router = useRouter();
  const supabase = createClient();


  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [releaseNote, setReleaseNote] = useState<string | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseFade, setReleaseFade] = useState(false);


  // Fetch once on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userErr || !user) {
        router.push("/login");
        return;
      }

      if (!cancelled) setUserEmail(user.email ?? null);

      // Pull only THIS user's letters
      const { data, error: qErr } = await supabase
        .from("letters")
        .select("id,user_id,title,body,status,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (qErr) {
        setError(qErr.message);
        setLetters([]);
      } else {
        setLetters((data as LetterRow[]) ?? []);
      }

      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }
  
  async function onDeleteLetter(e: React.MouseEvent, letterId: string) {
    e.preventDefault();
    e.stopPropagation();
  
    const ok = window.confirm(
      "Release this letter?\n\nYou don’t need to carry the weight of that letter anymore."
    );
    if (!ok) return;
  
    // Ritual starts
    setIsReleasing(true);
    setReleaseNote("You don’t need to carry the weight of that letter anymore.");
    setReleaseFade(false);

  
    // Optional: optimistic UI (remove immediately)
    setLetters((prev) => prev.filter((x) => x.id !== letterId));
  
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
  
    if (!user) {
      router.push("/login");
      return;
    }
  
    const { error } = await supabase
      .from("letters")
      .delete()
      .eq("id", letterId)
      .eq("user_id", user.id);
  
    if (error) {
      alert(`Release failed: ${error.message}`);
      setIsReleasing(false);
      setReleaseNote(null);
      setReleaseFade(false);

      router.refresh?.();
      return;
    }
   // Pause, then fade, then clear message
setTimeout(() => {
  setReleaseFade(true);
}, 1200);

setTimeout(() => {
  setIsReleasing(false);
  setReleaseNote(null);
  setReleaseFade(false);
}, 2200);
                                      // fully done after ~2.2s

  }
  
  
  

  

  const emptyState = useMemo(() => !loading && letters.length === 0 && !error, [loading, letters, error]);

  return (
    <div className="letters-shell">

    {releaseNote && (
  <div
    style={{
      margin: "12px 0 18px",
      textAlign: "center",
      fontSize: 14,
      color: "#6b6b6b",
      opacity: releaseFade ? 0 : 0.95,
      transition: "opacity 900ms ease",
    }}
  >
    {releaseNote}
  </div>
)}


{/* Back to home button */}
<Link href="/" className="nav-back">
  ← Back to home
</Link>

<h1 style={{ fontSize: 42, marginBottom: 6 }}>My Letters</h1>



      <div style={{ opacity: 0.75, marginBottom: 18 }}>
        Logged in as: <b>{userEmail ?? "…"}</b>
      </div>

      <div className="letters-actions">
  <button
    className="pill-primary"
    onClick={() => router.push("/letters/new")}
  >
    Begin a new letter
  </button>

  <button
    className="pill-secondary"
    onClick={onLogout}
  >
    Log out
  </button>
</div>


      {loading && <div style={{ opacity: 0.7 }}>Loading…</div>}

      {error && (
        <div style={{ color: "#b00020", marginTop: 10 }}>
          ❌ {error}
        </div>
      )}

      {emptyState && (
        <div style={{ opacity: 0.7, marginTop: 18 }}>
          No letters yet. Hit <b>New Letter</b> to create your first draft.
        </div>
      )}

      {!loading && !error && letters.length > 0 && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          {letters.map((l) => {
            const title = (l.title ?? "").trim() || "Untitled";
            const bodyPreview = snippet(l.body, 90);
            return (
              <Link
  key={l.id}
  href={`/letters/${l.id}`}
  className={`letter-row ${((l.status ?? "draft") === "draft") ? "is-draft" : ""}`}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>

    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>
        {formatDate(l.created_at)}
      </div>

      <button
        onClick={(e) => onDeleteLetter(e, l.id)}
        style={{
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.2)",
          background: "white",
          cursor: "pointer",
        }}
      >
      Release
  </button>
    </div>
  </div>

  <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center" }}>
    <span className="draft-badge">{l.status ?? "draft"}</span>

    <span className="preview">
      {bodyPreview ? bodyPreview : <i>(empty)</i>}
    </span>
  </div>
</Link>

                 
            );
          })}
        </div>
      )}
    </div>
  );
}
