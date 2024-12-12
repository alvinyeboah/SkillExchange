import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, achievement_id } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO UserAchievements (user_id, achievement_id) VALUES (?, ?)",
      [user_id, achievement_id]
    );

    return NextResponse.json({ message: "Achievement earned successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to earn achievement", error: error.message }, { status: 500 });
  }
} 