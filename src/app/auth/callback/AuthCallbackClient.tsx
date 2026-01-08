"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // optional: allow ?next=/somewhere
      const next = searchParams.get("next") || "/letters";

      // 1) Try PKCE code flow if present
      const code = searchParams.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        // Don’t trust the return value alone; verify session below.
      }

      // 2) Try hash/token flow if present
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.slice(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });

          // Clean the URL after processing hash
          window.history.replaceState({}, document.title, "/auth/callback");
        }
      }

      // 3) Give cookies a beat to settle, then check session (THIS is the key)
      await sleep(150);

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace(next);
        return;
      }

      // 4) If no session, then and only then go to login
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
