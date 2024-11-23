import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWTEdge } from './lib/jwt-edge';

const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/wallet',
  '/marketplace',
  '/challenges',
  '/community'
];

const authPaths = ['/auth/signin', '/auth/register'];
const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/check'];

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  
  // Allow public API routes
  if (publicApiRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // Get and verify auth token
  const authToken = request.cookies.get('authToken');
  const payload = authToken?.value ? await verifyJWTEdge(authToken.value) : null;
  const isValidSession = !!payload;

  // Handle auth paths (signin/register)
  if (authPaths.includes(currentPath)) {
    if (isValidSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected paths
  if (protectedPaths.includes(currentPath)) {
    if (!isValidSession) {
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('callbackUrl', currentPath);
      return NextResponse.redirect(signinUrl);
    }
  }

  // Add user info to headers for protected routes
  if (isValidSession && payload) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      username: payload.username
    }));
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};