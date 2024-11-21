import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  try {
    const [[totalUsers]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_users FROM Users`
    );
    const [[totalServices]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_services FROM Services`
    );
    const [[totalChallenges]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_challenges FROM Challenges`
    );

    return NextResponse.json(
      {
        total_users: totalUsers.total_users,
        total_services: totalServices.total_services,
        total_challenges: totalChallenges.total_challenges,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch analytics", error: error.message },
      { status: 500 }
    );
  }
}
