import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, password, name } = await req.json();

    // Check if the user already exists
    const existingUser = await withConnection(pool, async (connection) => {
      const [result]: any = await connection.query(
        "SELECT * FROM Users WHERE email = ?",
        [email]
      );
      return result;
    }, "check for existing user");

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatarUrl = `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`;

    await withConnection(pool, async (connection) => {
      await connection.query(
        `INSERT INTO Users (
          username, 
          email, 
          password_hash, 
          name,
          avatar_url,
          bio
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, name, defaultAvatarUrl, ""]
      );
    }, "post register");

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
