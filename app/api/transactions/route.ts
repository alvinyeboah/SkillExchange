import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  let connection;
  try {
    connection = await pool.getConnection();
    const transactions = await connection.query(
      "SELECT * FROM Transactions ORDER BY transaction_date DESC"
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(req: NextRequest) {
  let connection;
  try {
    const { from_user_id, to_user_id, service_id, skillcoins_transferred } = await req.json();
    connection = await pool.getConnection();

    // Insert a new transaction
    await connection.query(
      "INSERT INTO Transactions (from_user_id, to_user_id, service_id, skillcoins_transferred) VALUES (?, ?, ?, ?)",
      [from_user_id, to_user_id, service_id, skillcoins_transferred]
    );

    return NextResponse.json(
      { message: "Transaction created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create transaction", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
