import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read cookies if available; if not, return an empty list (middleware handles refresh anyway)
        getAll() {
          // Some Next.js types don't expose getAll on this cookie store in TS,
          // so we safely fall back.
          return (cookieStore as any).getAll?.() ?? [];
        },

        // Do NOT attempt to set cookies here.
        // In App Router Server Components, setting cookies is often disallowed.
        // Middleware (proxy.ts) is where we set/refresh cookies.
        setAll() {
          // no-op on purpose
        },
      },
    }
  );
}
