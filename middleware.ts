import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtManager } from "@/lib/auth";

const protectedRoutes = [
  "/dashboard",
  "/wallet",
  // Add other protected routes here
];

const authRoutes = ["/auth/signin", "/auth/signup"];

const verifyToken = async (token?: string) => {
  if (!token) return null;
  try {
    const payload = await jwtManager.verify(token);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;
  
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || 
    pathname.startsWith(`${route}/`) || 
    (pathname.startsWith(route) && pathname.length > route.length)
  );
  
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route
  );

  const createRedirectUrl = (path: string, message: string) => {
    const redirectUrl = new URL(path, request.url);
    if (message) {
      redirectUrl.searchParams.set("message", message);
    }
    if (path === "/auth/signin") {
      redirectUrl.searchParams.set("from", pathname);
    }
    return redirectUrl;
  };

  try {
    // Check protected routes
    if (isProtectedRoute) {
      if (!authToken) {
        return NextResponse.redirect(
          createRedirectUrl("/auth/signin", "Please sign in to access this page")
        );
      }

      const decodedToken = await verifyToken(authToken);
      if (!decodedToken) {
        const response = NextResponse.redirect(
          createRedirectUrl("/auth/signin", "Your session has expired. Please sign in again")
        );
        response.cookies.delete("authToken");
        return response;
      }
    }

    // Handle auth routes
    if (isAuthRoute && authToken) {
      const decodedToken = await verifyToken(authToken);
      if (decodedToken) {
        return NextResponse.redirect(createRedirectUrl("/dashboard", ""));
      }
      
      // Clear invalid token on auth routes
      const response = NextResponse.next();
      response.cookies.delete("authToken");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    
    const response = NextResponse.redirect(
      createRedirectUrl("/auth/signin", "An error occurred. Please sign in again")
    );
    response.cookies.delete("authToken");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public/|assets/).*)"
  ],
};