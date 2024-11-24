import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('authToken', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
  });

  const response = NextResponse.json({ message: 'Logout successful' });
  response.headers.set('Set-Cookie', cookie);

  return response;
} 