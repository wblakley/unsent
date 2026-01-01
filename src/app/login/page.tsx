"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  // If already logged in, bounce to /letters
  useEffect(() => {
    let isMounted = true;
  
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
  
      if (data.session) {
        router.replace("/letters");
      }
    }
  
    checkSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/letters");
    });
  
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);
  

  async function sendMagicLink() {
    setStatus("Sending link...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000/letters" },
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
