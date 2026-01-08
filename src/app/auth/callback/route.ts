import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Always land somewhere sane
  const redirectTo = `${url.origin}/letters`;

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // ✅ Cookie is now set server-side
  return NextResponse.redirect(redirectTo);
}
