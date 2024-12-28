import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {

  try {
    const { challenge_id, user_id } = await req.json();

    return await withConnection(async (connection) => {
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
    }, "Get participants");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to join challenge", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    return await withConnection(async (connection) => {
      let query = `
        SELECT 
          cp.challenge_id as id,
          c.title,
          c.description,
          c.reward_skillcoins
        FROM ChallengeParticipation cp
        JOIN Challenges c ON cp.challenge_id = c.challenge_id
      `;

      const params: string[] = [];
      if (userId) {
        query += ` WHERE cp.user_id = ?`;
        params.push(userId);
      }

      const [participants] = await connection.query(query, params);
      return NextResponse.json(participants, { status: 200 });
    }, "get participants");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch participants", error: error.message },
      { status: 500 }
    );
  }
}