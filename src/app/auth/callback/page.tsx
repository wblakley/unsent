"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // If you ever get ?code=... (PKCE flow), handle it too
      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace("/letters");
          return;
        }
      }

      // Your current links appear to be hash/token based
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.slice(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          // Clean the URL
          window.history.replaceState({}, document.title, "/auth/callback");

          if (!error) {
            router.replace("/letters");
            return;
          }
        }
      }

      router.replace("/login");
    };

    run();
  }, [router, searchParams]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Signing you in…</h1>
      <p>Please wait.</p>
    </div>
  );
}
