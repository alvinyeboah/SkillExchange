import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { name, description, creator_id } = await req.json();

    return await withConnection(async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO Communities (name, description, creator_id) VALUES (?, ?, ?)",
        [name, description, creator_id]
      );

      return NextResponse.json(
        {
          message: "Community created successfully",
          communityId: result.insertId,
        },
        { status: 201 }
      );
    }, "post community");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create community", error: error.message },
      { status: 500 }
    );
  }
}
