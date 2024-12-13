import { NextResponse } from 'next/server';
import pool, { withConnection } from '@/lib/db';
import bcrypt from 'bcrypt';
import { signJWT } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    return await withConnection(pool, async (connection) => {
      const [users]: any = await connection.query(
        'SELECT user_id, name, username, email, skillcoins, created_at, updated_at, role, status, avatar_url, password_hash FROM Users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid Password' }, { status: 401 });
      }

      // Generating token using Node.js JWT
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
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          skills: user.skills,
          skillcoins: user.skillcoins,
          created_at: user.created_at,
          updated_at: user.updated_at,
          role: user.role,
          status: user.status,
          avatar_url: user.avatar_url
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
    });
  } catch (error: any) {
    return NextResponse.json({
      message: 'Login failed',
      error: error.message
    }, { status: 500 });
  }
}