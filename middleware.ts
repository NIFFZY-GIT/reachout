import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "noreferrer");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (request.nextUrl.pathname === "/chat" || request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  }
  return response;
}
