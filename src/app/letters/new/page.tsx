"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewLetterPage() {
  const router = useRouter();

  // ✅ Make supabase instance stable (same object across renders)
  const supabase = useMemo(() => createClient(), []);

  const [msg, setMsg] = useState("Creating your new letter...");

  // ✅ Prevent double-run (helps in dev/StrictMode)
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const run = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("letters")
        .insert({
          user_id: user.id,
          title: "Untitled",
          body: "",
          status: "draft",
        })
        .select("id")
        .single();

      if (error || !data?.id) {
        setMsg(`Error creating letter: ${error?.message ?? "Unknown error"}`);
        return;
      }
      const newId = data.id;
router.push(`/letters/${newId}?new=1`);

    };

    run();
  }, [router, supabase]);

  return (
    <div style={{ padding: 40, maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>New Letter</h1>
      <p style={{ opacity: 0.7 }}>{msg}</p>
    </div>
  );
}
