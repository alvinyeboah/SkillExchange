import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { jwtManager } from "@/lib/auth";

interface UserRow extends RowDataPacket {
  user_id: number;
  name: string;
  username: string;
  email: string;
  skillcoins: number;
  created_at: Date;
  updated_at: Date;
  role: string;
  status: string;
  avatar_url: string;
}

export async function GET(req: NextRequest) {
  // Helper function to create unauthorized response
  const createUnauthorizedResponse = () => {
    const response = NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return response;
  };

  try {
    const authToken = req.cookies.get("authToken")?.value;

    if (!authToken) {
      return createUnauthorizedResponse();
    }

    const payload = await jwtManager.verify(authToken);
    if (!payload) {
      return createUnauthorizedResponse();
    }

    return await withConnection(async (connection) => {
      const [users] = (await connection.query<UserRow[]>(
        "SELECT user_id, name, username, email, skillcoins, created_at, updated_at, role, status, avatar_url FROM Users WHERE user_id = ? AND user_id > 0",
        [payload.userId]
      )) as [UserRow[], any];

      if (!users || users.length === 0) {
        return createUnauthorizedResponse();
      }

      const user = users[0];
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.user_id,
          name: user.name,
          username: user.username,
          email: user.email,
          skillcoins: user.skillcoins,
          created_at: user.created_at,
          updated_at: user.updated_at,
          role: user.role,
          status: user.status,
          avatar_url: user.avatar_url,
        },
      });
    }, "Get Check");
  } catch (error) {
    console.error("Auth check error:", error);
    return createUnauthorizedResponse();
  }
}
