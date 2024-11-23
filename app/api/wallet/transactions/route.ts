import { pool } from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const userId = req.headers.get('user-id');

  try {
    const [transactions] = await pool.query(
      "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY created_at DESC",
      [userId, userId]
    );

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  }
} 