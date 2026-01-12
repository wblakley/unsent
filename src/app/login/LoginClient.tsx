"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginClient() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/letters";
   

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setLoading(true);
    setStatus("Sending code...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) {
      setStatus("❌ " + error.message);
      setLoading(false);
      return;
    }

    setStage("code");
    setStatus("✅ Check your email for the 6-digit code.");
    setLoading(false);
  }

  async function verifyCode() {
    setLoading(true);
    setStatus("Verifying code...");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setStatus("❌ " + error.message);
      setLoading(false);
      return;
    }
// 🔑 IMPORTANT: make sure session is present client-side
await supabase.auth.getSession();

setStatus("✅ Signed in! Redirecting...");

// ✅ Production-safe redirect: force a full navigation so middleware/server sees cookie
window.location.assign(next);
setLoading(false);

  }

  return (
    <div style={{ padding: 40, maxWidth: 520 }}>
      <h1>Login</h1>

      {stage === "email" ? (
        <>
          <p>Enter your email and we’ll send you a one-time code.</p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: "100%", padding: 12, marginTop: 12 }}
            autoComplete="email"
          />

          <button
            onClick={sendCode}
            style={{ marginTop: 12, padding: "10px 14px" }}
            disabled={!email || loading}
          >
            {loading ? "Sending..." : "Send code"}
          </button>
        </>
      ) : (
        <>
          <p>
            Enter the 6-digit code sent to <b>{email}</b>.
          </p>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            style={{
              width: "100%",
              padding: 12,
              marginTop: 12,
              textAlign: "center",
              letterSpacing: 6,
            }}
            inputMode="numeric"
          />

          <button
            onClick={verifyCode}
            style={{ marginTop: 12, padding: "10px 14px" }}
            disabled={code.length !== 6 || loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            onClick={() => {
              setStage("email");
              setCode("");
              setStatus("");
            }}
            style={{ marginTop: 12, padding: "10px 14px" }}
            disabled={loading}
          >
            Back
          </button>
        </>
      )}

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
