import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { withConnection } from "@/lib/db";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const userId = params.id;

    const [transactions] = await withConnection(async (connection) => {
      return await connection.query<RowDataPacket[]>(
        "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY transaction_date DESC",
        [userId, userId]
      );
    }, "Transaction get individual");

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user transactions", error: error.message },
      { status: 500 }
    );
  }
}
