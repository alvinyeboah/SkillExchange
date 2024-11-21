import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function authMiddleware(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.headers.set('user', JSON.stringify(decoded));
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
}
