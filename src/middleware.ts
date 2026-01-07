import { updateSession } from "@/utils/supabase/proxy";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
