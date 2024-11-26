import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [challenges] = await connection.query<RowDataPacket[]>(
      "SELECT challenge_id, title, reward_skillcoins, start_date, end_date, created_at FROM Challenges ORDER BY start_date DESC"
    );

    return NextResponse.json(challenges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch challenges", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function DELETE(req: Request) {
  let connection;
  try {
    const { challenge_id } = await req.json();
    connection = await pool.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM Challenges WHERE challenge_id = ?",
      [challenge_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Challenge deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete challenge", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
