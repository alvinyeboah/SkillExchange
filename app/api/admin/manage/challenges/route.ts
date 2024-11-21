import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  try {
    const [challenges] = await pool.query<RowDataPacket[]>(
      "SELECT challenge_id, title, reward_skillcoins, start_date, end_date, created_at FROM Challenges ORDER BY start_date DESC"
    );

    return NextResponse.json(challenges, { status: 200 });
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

    const [result] = await pool.query<ResultSetHeader>(
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
  }
}
