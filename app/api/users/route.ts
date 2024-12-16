import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { withConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  // requires no auth
  // const authResult = await authMiddleware(req);
  // if (authResult instanceof Response) return authResult;

  try {
    // Use withConnection to handle the database connection
    const [users] = await withConnection(async (connection) => {
      return await connection.query(
        `SELECT 
          user_id,
          username,
          avatar_url,
          email
         FROM Users 
         ORDER BY username ASC`
      );
    }, "get user");

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
