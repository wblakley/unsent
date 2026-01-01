"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


type Letter = {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  status: string | null;
  created_at: string;
};

export default function LetterPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = createClient();
  


  const letterId = useMemo(() => {
    const raw = params?.id;
    return typeof raw === "string" ? raw : "";
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [letter, setLetter] = useState<Letter | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Prevent autosave from firing immediately on first load
  const hydratedRef = useRef(false);

  // 1) Require login + load letter
  useEffect(() => {
    const run = async () => {
      if (!letterId) {
        setLoading(false);
        setMsg("Missing letter id in the URL.");
        return;
      }

      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      const { data, error } = await supabase
      .from("letters")
      .select("id,user_id,title,body,status,created_at")
      .eq("id", letterId)
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    
     

      if (error) {
        setMsg(`Error loading letter: ${error.message}`);
        setLoading(false);
        return;
      }

      setLetter(data as Letter);
      setTitle((data?.title ?? "Untitled") as string);
      setBody((data?.body ?? "") as string);

      hydratedRef.current = true;
      setLoading(false);
    };

    run();
  }, [letterId, router]);

  // 2) Autosave title/body (debounced)
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!userId) return;
    if (!letterId) return;

    const t = setTimeout(async () => {
      setSaving(true);
      setMsg(null);

      const { error } = await supabase
        .from("letters")
        .update({
          title: title.trim() ? title : "Untitled",
          body: body,
        })
        .eq("id", letterId)
        .eq("user_id", userId);

      if (error) {
        setMsg(`Error saving: ${error.message}`);
      } else {
        setMsg("Saved.");
      }

      setSaving(false);
    }, 700);

    return () => clearTimeout(t);
  }, [title, body, userId, letterId]);



  

  // 3) UI states (after hooks ✅)
  if (loading) {
    return <div className="editor-shell">Loading…</div>;
  }
  

  
  if (!letterId) {
    return (
      <div className="editor-shell">
        <p>❌ Missing letter id in the URL.</p>
        <button
  className="pill-secondary"
  onClick={() => router.push("/letters")}
>
  ← Back to letters
</button>

      </div>
    );
  }
  
  if (!letter) {
    return (
      <div className="editor-shell">
        <p>{msg ?? "Letter not found."}</p>
        <button className="pill-back" onClick={() => router.push("/letters")}>
  ← Back to letters
</button>


      </div>
    );
  }
  
  return (
    <div className="editor-shell">
      <div className="editor-card">
        <button onClick={() => router.push("/letters")}>← Back to letters</button>

        <h1 style={{ marginTop: 20, fontSize: 44, fontFamily: "serif" }}>
          {title || "Untitled"}
        </h1>

        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Created {new Date(letter.created_at).toLocaleString()}
        </p>

        <p style={{ marginTop: 8 }}>
          Status: <b>{letter.status ?? "draft"}</b>
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            {saving ? "Saving..." : msg ?? " "}
          </span>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              marginTop: 6,
            }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>
            Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={12}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              marginTop: 6,
            }}
            placeholder="Write your letter here..."
          />
        </div>
      </div>
    </div>
  );
}
