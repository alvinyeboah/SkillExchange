import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    // Get total users
    const [[users]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_users FROM Users WHERE status = 'active'`
    );

    // Get total services
    const [[services]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total_services FROM Services WHERE status = 'active'`
    );

    // Get active challenges
    const [[challenges]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS active_challenges FROM Challenges 
       WHERE status = 'active' AND end_date >= CURDATE()`
    );

    // Get popular skills
    const [popularSkills] = await pool.query<RowDataPacket[]>(`
      SELECT 
        title AS skill, 
        COUNT(*) AS usage_count 
      FROM Services 
      WHERE status = 'active'
      GROUP BY title 
      ORDER BY usage_count DESC 
      LIMIT 5
    `);

    // Get leaderboard
    const [leaderboard] = await pool.query<RowDataPacket[]>(`
      SELECT 
        u.user_id,
        u.username,
        u.skillcoins,
        u.avatar_url
      FROM Users u
      WHERE u.status = 'active'
      ORDER BY u.skillcoins DESC
      LIMIT 10
    `);

    return NextResponse.json(
      {
        total_users: users.total_users,
        total_services: services.total_services,
        active_challenges: challenges.active_challenges,
        popular_skills: popularSkills,
        leaderboard: leaderboard
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch  dashboard stats", error: error.message },
      { status: 500 }
    );
  }
}
