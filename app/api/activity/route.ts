import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    // Fetch activity data from the database
    const [activityData] = await connection.query(`
      SELECT * FROM Activity WHERE status = 'pending'
    `);

    return NextResponse.json(activityData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch activity data", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}