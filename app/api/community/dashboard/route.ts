import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [activeUsers] = await connection.query(
      "SELECT COUNT(*) as count FROM Users WHERE updated_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
    );

    const [topProviders] = await connection.query(
      "SELECT u.*, AVG(r.rating_value) as avg_rating FROM Users u LEFT JOIN Ratings r ON u.user_id = r.user_id GROUP BY u.user_id ORDER BY avg_rating DESC LIMIT 5"
    );

    return NextResponse.json({
      activeUsers,
      topProviders
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch community stats", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
