import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const [[users]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_users FROM Users`
    );
    const [[services]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_services FROM Services`
    );
    const [[challenges]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS active_challenges FROM Challenges WHERE end_date >= CURDATE()`
    );
    const [popularSkills] = await pool.query<RowDataPacket[]>(`
      SELECT 
        title AS skill, 
        COUNT(*) AS usage_count 
      FROM Services 
      GROUP BY title 
      ORDER BY usage_count DESC 
      LIMIT 5
    `);

    return NextResponse.json(
      {
        total_users: users.total_users,
        total_services: services.total_services,
        active_challenges: challenges.active_challenges,
        popular_skills: popularSkills,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch community dashboard", error: error.message },
      { status: 500 }
    );
  }
}
