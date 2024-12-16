import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";

export async function GET(req: Request) {
  return await withConnection(async (connection) => {
    const activeUsers = await connection.query(
      "SELECT COUNT(*) as count FROM Users "
    );

    const [topProviders] = await connection.query(
      "SELECT u.*, AVG(r.rating_value) as avg_rating FROM Users u LEFT JOIN Ratings r ON u.user_id = r.user_id GROUP BY u.user_id ORDER BY avg_rating DESC LIMIT 5"
    );

    return NextResponse.json({
      activeUsers,
      topProviders,
    });
  }, "get community stats");
}
