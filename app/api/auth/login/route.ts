import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { signJWT } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [users]: any = await pool.query(
      'SELECT user_id, email, username, password_hash, role FROM Users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate token using Node.js JWT
    const token = signJWT({
      userId: user.user_id,
      email: user.email,
      role: user.role,
      username: user.username
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    }, { status: 200 });

    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({
      message: 'Login failed',
      error: error.message
    }, { status: 500 });
  }
}