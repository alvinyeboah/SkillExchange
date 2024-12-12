import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    // Fetch users with basic info
    const [users] = await pool.query(
      `SELECT 
        user_id,
        username,
        email
       FROM Users 
       ORDER BY username ASC`
    );

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
