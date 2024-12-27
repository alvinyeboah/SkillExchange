import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { jwtManager } from "@/lib/auth";


interface UserRow {
  user_id: number;
  name: string;
  username: string;
  email: string;
  bio?: string;
  skills?: string;
  skillcoins: number;
  created_at: Date;
  updated_at: Date;
  role: string;
  status: string;
  avatar_url: string;
  password_hash: string;
}

export async function POST(req: Request) {
  
  try {
    const { email, password } = await req.json();

    return await withConnection(async (connection) => {
      const [users] = await connection.query<any[]>(
        "SELECT user_id, name, username, email, skillcoins, created_at, updated_at, role, status, avatar_url, password_hash FROM Users WHERE email = ? AND user_id > 0",
        [email]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 401 }
        );
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid Password" },
          { status: 401 }
        );
      }

      // Generate token using the new JWT manager (24 hours expiration)
      const token = await jwtManager.sign(
        {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          username: user.username,
        },
        24
      ); // 24 hours expiration

      const response = NextResponse.json(
        {
          message: "Login successful",
        },
        { status: 200 }
      );

      response.cookies.set({
        name: "authToken",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 2, // 24 hours in seconds
        path: "/",
      });

      return response;
    }, "Post Login");
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Login failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
