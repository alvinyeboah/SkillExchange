import { NextResponse } from 'next/server';
import { verifyToken } from '../auth';

export async function authMiddleware(req: Request) {
  const userHeader = req.headers.get('user');
  if (!userHeader) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = JSON.parse(userHeader);
    if (!user.userId) {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 401 });
    }
    return null; // Authentication successful
  } catch {
    return NextResponse.json({ message: 'Invalid user data format' }, { status: 401 });
  }
} 