import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { name, description, creator_id } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
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
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create community", error: error.message },
      { status: 500 }
    );
  }
}