"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  // If already logged in, go to /letters (one-time check only)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && data.session) {
        router.replace("/letters");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function sendMagicLink() {
    setStatus("Sending link...");

    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) setStatus("❌ " + error.message);
    else setStatus("✅ Check your email for the login link.");
  }

  return (
    <div style={{ padding: 40, maxWidth: 520 }}>
      <h1>Login</h1>
      <p>Enter your email and we’ll send you a magic link.</p>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        style={{ width: "100%", padding: 12, marginTop: 12 }}
      />

      <button
        onClick={sendMagicLink}
        style={{ marginTop: 12, padding: "10px 14px" }}
        disabled={!email}
      >
        Send magic link
      </button>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
