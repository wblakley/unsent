import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ Allow auth + login routes always
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/privacy-policy") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // ✅ TEMPORARY: do NOT protect /letters in middleware
  // This prevents the server from bouncing you back to /login
  // while the client session lives in localStorage.
  if (pathname.startsWith("/letters")) {
    return NextResponse.next();
  }

  // If you had other protected routes, you can add them later properly with cookie-based auth.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
