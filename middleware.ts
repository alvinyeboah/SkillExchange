import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export function middleware(req: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/wallet'];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = req.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  return NextResponse.next();
}
