import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const [users]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Generate token
    const token = generateToken({ userId: user.user_id, role: user.role });

    // Set cookie with the token
    const cookie = serialize('authToken', token, {
      path: '/', // Cookie available site-wide
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Secure in production
      maxAge: 60 * 60, // 1 hour
    });

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie); // Attach cookie to the response

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });
  }
}
