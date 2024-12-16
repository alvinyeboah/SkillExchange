import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const donations = await withConnection(async (connection) => {
      let query = `SELECT * FROM Donations`;
      const params: any[] = [];

      if (userId) {
        query += ` WHERE from_user_id = ? OR to_user_id = ?`;
        params.push(userId, userId);
      }

      query += ` ORDER BY created_at DESC`;
      const [results] = await connection.query(query, params);
      return results;
    }, "get donations");

    return NextResponse.json(donations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch donations", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { from_user_id, to_user_id, amount } = await req.json();

    await withConnection(async (connection) => {
      await connection.query(
        "INSERT INTO Donations (from_user_id, to_user_id, amount) VALUES (?, ?, ?)",
        [from_user_id, to_user_id, amount]
      );
    }, "post donation");

    return NextResponse.json(
      { message: "Donation created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create donation", error: error.message },
      { status: 500 }
    );
  }
}
