// src/app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LatestLetter = { id: string };


export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [latest, setLatest] = useState<LatestLetter | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;

      // If not logged in, don’t show continue button
      if (!user) {
        setLatest(null);
        return;
      }

      const { data, error } = await supabase
        .from("letters")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.log("latest letter error:", error.message);
        setLatest(null);
        return;
      }

      setLatest(data ? { id: data.id } : null);
    };

    run();
  }, [supabase]);


  return (
    <div className="letter-shell-inner">
      <section className="letter-card">
       

        <header className="letter-card-header">
          <p className="letter-card-tagline">For everything you never got to say</p>
          <h1 className="letter-card-title">Unsent</h1>
        </header>

        <div className="letter-card-body">
          <p>Some things were never meant to be sent.</p>
          <p>
            This is a place to write what you couldn&apos;t say — or weren&apos;t ready
            to. There&apos;s no right way to begin.
          </p>
        </div>

        <div className="pill-row">
        <Link className="pill-primary" href="/letters/new">

            Begin a letter
          </Link>

          {latest && (
  <Link
    className="pill-ghost"
    href={`/letters/${latest.id}`}
  >
    Continue latest draft
  </Link>
)}
 
        </div>
      </section>
    </div>
  );
}
