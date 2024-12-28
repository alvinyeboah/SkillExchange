import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const publicPaths = [
  "/",
  "/auth/signin",
  "/auth/register",
  "/marketplace",
  "/stats",
  "/challenges",
];

export async function middleware(request: NextRequest) {
  // update user's auth session
  const res = await updateSession(request);

  // Check if the path requires authentication
  const path = request.nextUrl.pathname;
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith("/api/")
  );

  if (!isPublicPath) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-protected-route", "true");
    res.headers.set("x-protected-route", "true");
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
