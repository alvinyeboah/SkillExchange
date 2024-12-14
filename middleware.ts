import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

const protectedRoutes = [
  "/dashboard",
  "/wallet",
  // Add other protected routes here
];

const authRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;
  
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Check protected routes first
  if (isProtectedRoute) {
    // If no token exists, redirect to sign in
    if (!authToken) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("from", pathname);
      redirectUrl.searchParams.set(
        "message",
        "Please sign in to access this page"
      );
      return NextResponse.redirect(redirectUrl);
    }

    // Verify token validity
    try {
      await verifyJWT(authToken);
    } catch (error) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("from", pathname);
      redirectUrl.searchParams.set(
        "message",
        "Your session has expired. Please sign in again"
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute && authToken) {
    try {
      await verifyJWT(authToken);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // If token is invalid, allow access to auth routes
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};