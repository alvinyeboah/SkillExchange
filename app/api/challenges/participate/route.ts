import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  let connection;
  try {
    const { challenge_id, user_id } = await req.json();
    connection = await pool.getConnection();

    // Check if challenge exists and is active
    const [[challenge]] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM Challenges 
       WHERE challenge_id = ? 
       AND start_date <= CURRENT_DATE() 
       AND end_date >= CURRENT_DATE()`,
      [challenge_id]
    );

    if (!challenge) {
      return NextResponse.json(
        { message: "Challenge not found or not active" },
        { status: 404 }
      );
    }

    // Check if user is already participating
    const [[existing]] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM ChallengeParticipation 
       WHERE challenge_id = ? AND user_id = ?`,
      [challenge_id, user_id]
    );

    if (existing) {
      return NextResponse.json(
        { message: "Already participating in this challenge" },
        { status: 400 }
      );
    }

    // Add participation
    await connection.query(
      `INSERT INTO ChallengeParticipation (
        challenge_id, user_id, progress, joined_at
      ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [challenge_id, user_id, 0]
    );

    return NextResponse.json(
      { message: "Successfully joined the challenge" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to join challenge", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
