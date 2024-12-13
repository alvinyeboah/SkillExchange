import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import {ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { user_id, achievement_id } = await req.json();

    await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO UserAchievements (user_id, achievement_id) VALUES (?, ?)",
        [user_id, achievement_id]
      );

      if (!result.affectedRows) {
        throw new Error("Failed to insert achievement");
      }
    });

    return NextResponse.json(
      { message: "Achievement earned successfully" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Achievement error:", error);
    
    return NextResponse.json(
      { 
        message: "Failed to earn achievement", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}
