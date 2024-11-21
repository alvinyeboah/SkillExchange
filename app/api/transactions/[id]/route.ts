import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const [transactions] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY transaction_date DESC",
      [params.id, params.id]
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user transactions", error: error.message },
      { status: 500 }
    );
  }
}
