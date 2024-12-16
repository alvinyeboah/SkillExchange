import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";

export async function GET() {
  return withConnection(async (connection) => {
    const [activityData] = await connection.query(`
      SELECT * FROM Activity WHERE status = 'pending'
    `);
    return NextResponse.json(activityData, { status: 200 });
  }, "Get Activity").catch((error: any) => {
    return NextResponse.json(
      { message: "Failed to fetch activity data", error: error.message },
      { status: 500 }
    );
  });
}
