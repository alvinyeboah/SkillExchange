import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, email, password, name } = await req.json();

    // Check if the user already exists
    const [existingUser]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default avatar URL using a service like Gravatar or a default image
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`;

    // Insert the new user into the database
    await pool.query(
      `INSERT INTO Users (
        username, 
        email, 
        password_hash, 
        name,
        avatar_url
      ) VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, name, defaultAvatarUrl]
    );

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Registration failed', error: error.message }, { status: 500 });
  }
}
