import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Fetch activity data from the database
    const [activityData] = await pool.query(`
      SELECT * FROM Activity WHERE status = 'pending'
    `);

    return NextResponse.json(activityData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch activity data", error: error.message },
      { status: 500 }
    );
  }
}