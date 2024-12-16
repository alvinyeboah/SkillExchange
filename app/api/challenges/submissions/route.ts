import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { challenge_id, user_id, content, submission_url } = await req.json();

    const [result] = await withConnection(async (connection) => {
      return await connection.query<ResultSetHeader>(
        "INSERT INTO ChallengeSubmissions (challenge_id, user_id, content, submission_url) VALUES (?, ?, ?, ?)",
        [challenge_id, user_id, content, submission_url]
      );
    }, "create submission");

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submissionId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create submission", error: error.message },
      { status: 500 }
    );
  }
}
