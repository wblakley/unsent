"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [status, setStatus] = useState<string>("");

  // show supabase error if it redirected here
  const err = searchParams.get("error_description");

  async function sendOtp() {
    setStatus("Sending code...");

    // IMPORTANT: do NOT pass emailRedirectTo
    // This makes it OTP-first instead of link-first.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // keep users you already created
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("❌ " + error.message);
      return;
    }

    setStatus("✅ Check your email for the 6-digit code.");
    setStep("otp");
  }

  async function verifyOtp() {
    setStatus("Verifying...");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setStatus("❌ " + error.message);
      return;
    }

    setStatus("✅ Logged in!");
    router.replace("/letters");
  }

  return (
    <div style={{ padding: 40, maxWidth: 520 }}>
      <h1>Login</h1>

      {err && (
        <p style={{ color: "#b00020" }}>
          ❌ {decodeURIComponent(err.replace(/\+/g, " "))}
        </p>
      )}

      {step === "email" ? (
        <>
          <p>Enter your email and we’ll send you a 6-digit code.</p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: "100%", padding: 12, marginTop: 12 }}
          />

          <button
            onClick={sendOtp}
            style={{ marginTop: 12, padding: "10px 14px" }}
            disabled={!email}
          >
            Send code
          </button>
        </>
      ) : (
        <>
          <p>
            Enter the 6-digit code sent to <b>{email}</b>.
          </p>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            style={{ width: "100%", padding: 12, marginTop: 12 }}
          />

          <button
            onClick={verifyOtp}
            style={{ marginTop: 12, padding: "10px 14px" }}
            disabled={otp.length < 6}
          >
            Verify code
          </button>

          <button
            onClick={() => {
              setOtp("");
              setStep("email");
              setStatus("");
            }}
            style={{ marginTop: 12, padding: "10px 14px", marginLeft: 10 }}
          >
            Start over
          </button>
        </>
      )}

      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
