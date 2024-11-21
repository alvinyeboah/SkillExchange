import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user wallet summary
    const [wallet] = await pool.query<RowDataPacket[]>(
      "SELECT user_id, username, email, skillcoins AS balance FROM Users WHERE user_id = ?",
      [userId]
    );

    if (wallet.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch transaction history for the user
    const [transactions] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Transactions WHERE from_user_id = ? OR to_user_id = ? ORDER BY transaction_date DESC",
      [userId, userId]
    );

    return NextResponse.json(
      { wallet: wallet[0], transactions },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch wallet", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const { userId, adjustment } = await req.json();

    if (!userId || typeof adjustment !== "number") {
      return NextResponse.json(
        { message: "User ID and adjustment are required" },
        { status: 400 }
      );
    }

    // Update user skillcoin balance
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE Users SET skillcoins = skillcoins + ? WHERE user_id = ?",
      [adjustment, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Wallet updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update wallet", error: error.message },
      { status: 500 }
    );
  }
}
