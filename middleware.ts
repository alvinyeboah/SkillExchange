import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/jwt';
import { rateLimiter } from './lib/middleware/rateLimiter';

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

export async function middleware(request: NextRequest) {
  // Rate limiting check
  const rateLimitResult = await rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
  })(request);

  if (rateLimitResult) return rateLimitResult;

  const response = await handleRequest(request);
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const currentPath = request.nextUrl.pathname;
  
  // Example logic to handle the request
  if (currentPath === '/some-path') {
    return NextResponse.json({ message: 'Handled specific path' });
  }

  // Default response if no specific path is handled
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};