import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    return await withConnection(async (connection) => {
      const [leaderboard] = await connection.query<RowDataPacket[]>(`
        SELECT 
          Users.user_id, 
          Users.username, 
          Users.skillcoins AS total_skillcoins,
          Users.avatar_url AS avatar_url,
          AVG(Ratings.rating_value) AS avg_rating,
          COUNT(Ratings.rating_id) AS total_ratings
        FROM Users
        LEFT JOIN Ratings ON Ratings.user_id = Users.user_id
        GROUP BY Users.user_id
        ORDER BY total_skillcoins DESC, avg_rating DESC
        LIMIT 10
      `);

      return NextResponse.json(leaderboard, { status: 200 });
    }, "get leaderboards");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch leaderboard", error: error.message },
      { status: 500 }
    );
  }
}
