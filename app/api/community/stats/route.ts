import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const [activeUsers] = await pool.query(
      "SELECT COUNT(*) as count FROM Users WHERE last_active > DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
    );
    
    const [topProviders] = await pool.query(
      "SELECT u.*, AVG(r.rating) as avg_rating FROM Users u LEFT JOIN Reviews r ON u.user_id = r.provider_id GROUP BY u.user_id ORDER BY avg_rating DESC LIMIT 5"
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
  }
} 