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
    (currentUrl.pathname.startsWith("/signin") ||
      currentUrl.pathname.startsWith("/signup") ||
      currentUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/u/notebooks", req.url));
  }

  if (!token && currentUrl.pathname.startsWith("/u/")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (
    !token &&
    (currentUrl.pathname.startsWith("/api/discussion/") ||
      currentUrl.pathname.startsWith("/api/reply/"))
  ) {
    return NextResponse.json(
      new ApiError(401, "Unauthorized access to the API"),
      {
        status: 401,
      }
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("user-id", token?._id as string);

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
    "/signin",
    "/signup",
    "/api/discussion/:path*",
    "/api/reply/:path*",
    "/api/notebook/:path*",
    "/api/summarize/:path*",
    "/api/summaries/:path*",
    "/api/quiz/:path*",
  ],
};
