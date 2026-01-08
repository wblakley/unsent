"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginClient() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  async function sendMagicLink() {
    setStatus("Sending code...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setStatus("❌ " + error.message);
    else setStatus("✅ Check your email for the 6-digit code.");
  }

  return (
    <div style={{ padding: 40, maxWidth: 520 }}>
      <h1>Login</h1>
      <p>Enter your email and we’ll send you a one-time code.</p>

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
        Send code
      </button>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
