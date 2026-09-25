// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. If accessing login with a valid token -> go to dashboard
  if (pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. If accessing root "/admin"
  if (pathname === "/admin") {
    const destination = token ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. If accessing any other protected /admin/* routes without a token
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ensure matcher captures both /admin and /admin/:path*
  matcher: ["/admin", "/admin/:path*"],
};
