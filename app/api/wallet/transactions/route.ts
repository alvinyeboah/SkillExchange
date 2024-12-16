import pool, { withConnection } from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

interface Transaction extends RowDataPacket {
  transaction_id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  created_at: Date;
  description?: string;
}

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const userId = req.headers.get("user-id");

  try {
    return await withConnection(async (connection) => {
      const transactions = await connection.query<Transaction[]>(
        "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY created_at DESC",
        [userId, userId]
      );

      return NextResponse.json(transactions);
    }, "get wallet transaction");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  }
}
