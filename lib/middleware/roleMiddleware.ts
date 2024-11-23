import { NextResponse } from 'next/server';

export function roleMiddleware(req: Request, requiredRoles: string[]) {
  const userHeader = req.headers.get('user');
  if (!userHeader) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const user = JSON.parse(userHeader);
  if (!requiredRoles.includes(user.role)) {
    return NextResponse.json({ message: 'x' }, { status: 403 });
  }

  return NextResponse.next();
}
