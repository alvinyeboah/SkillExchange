import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { withConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    // Use withConnection to handle the database connection
    const transactions = await withConnection(pool, async (connection) => {
      return await connection.query(
        "SELECT * FROM Transactions ORDER BY transaction_date DESC"
      );
    }, " get transactions");

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { from_user_id, to_user_id, service_id, skillcoins_transferred } = await req.json();
    
    await withConnection(pool, async (connection) => {
      await connection.query(
        "INSERT INTO Transactions (from_user_id, to_user_id, service_id, skillcoins_transferred) VALUES (?, ?, ?, ?)",
        [from_user_id, to_user_id, service_id, skillcoins_transferred]
      );
    }, "post transactions");

    return NextResponse.json(
      { message: "Transaction created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create transaction", error: error.message },
      { status: 500 }
    );
  }
}
