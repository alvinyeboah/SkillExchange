import { NextRequest, NextResponse } from 'next/server';
import { jwtManager } from '@/lib/auth';

export async function authMiddleware(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value;
  if (!authToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const payload = jwtManager.verify(authToken);
  if (!payload) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
  return null;
}