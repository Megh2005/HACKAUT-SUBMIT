import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "./utils/ApiError";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
  });

  const currentUrl = req.nextUrl;

  // client side redirect

  if (
    token &&
    token.role !== "creator" &&
    currentUrl.pathname.startsWith("/c/")
  ) {
    return NextResponse.redirect(new URL("/u/home", req.url));
  }

  if (
    token &&
    (currentUrl.pathname.startsWith("/login") ||
      currentUrl.pathname.startsWith("/signup") ||
      currentUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/u/home", req.url));
  }

  if (
    !token &&
    (currentUrl.pathname.startsWith("/u/") ||
      currentUrl.pathname.startsWith("/c/") ||
      currentUrl.pathname.startsWith("/watch/"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("user-id", token?.id as string);

  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    "/",
    "/u/:path*",
    "/c/:path*",
    "/watch/:path*",
    "/login",
    "/signup",
  ],
};
