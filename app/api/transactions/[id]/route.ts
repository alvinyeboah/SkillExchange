import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const userId = await params.id;

    const [transactions] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY transaction_date DESC",
      [userId, userId]
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user transactions", error: error.message },
      { status: 500 }
    );
  }
}
