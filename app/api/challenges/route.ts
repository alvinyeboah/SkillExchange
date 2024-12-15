import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  try {
    return await withConnection(pool, async (connection) => {
      const [challenges] = await connection.query<RowDataPacket[]>(
        "SELECT challenge_id, title,difficulty,category,skills, reward_skillcoins, start_date, end_date, created_at FROM Challenges ORDER BY start_date DESC"
      );

      return NextResponse.json(challenges, { status: 200 });
    }, "get challengea");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch challenges", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { challenge_id } = await req.json();

    return await withConnection(pool, async (connection) => {
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
    }, "delete challenge");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete challenge", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, difficulty, category, skills, status, reward_skillcoins, start_date, end_date } = await req.json();

    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO Challenges (title, difficulty, category, skills, reward_skillcoins, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, difficulty, category, skills, status, reward_skillcoins, start_date, end_date]
      );

      return NextResponse.json(
        { message: "Challenge added successfully", challenge_id: result.insertId },
        { status: 201 }
      );
    }, "add challenge");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add challenge", error: error.message },
      { status: 500 }
    );
  }
}
