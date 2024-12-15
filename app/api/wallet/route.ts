import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db"; // Import withConnection
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: NextRequest) {
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

    // Use withConnection to handle the database operations
    return await withConnection(pool, async (connection) => {
      await connection.beginTransaction();

      const [users] = await connection.query<RowDataPacket[]>(
        "SELECT user_id, username, email, skillcoins FROM Users WHERE user_id = ?",
        [userId]
      );

      if (users.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const user = users[0];

      // Fetch transaction history
      const [transactions] = await connection.query<RowDataPacket[]>(
        `SELECT 
          t.*,
          CASE 
            WHEN from_user_id = ? THEN 'Spent'
            ELSE 'Earned'
          END as type
        FROM Transactions t
        WHERE from_user_id = ? OR to_user_id = ?
        ORDER BY transaction_date DESC`,
        [userId, userId, userId]
      );

      await connection.commit();

      return NextResponse.json(
        {
          balance: user.skillcoins,
          user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
          },
          transactions,
        },
        { status: 200 }
      );
    }, "get wallet");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch wallet", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { from_user_id, to_user_id, service_id, skillcoins_transferred } =
      await req.json();

    // Use withConnection to handle the database operations
    await withConnection(pool, async (connection) => {
      // Insert a new transaction
      await connection.query(
        "INSERT INTO Transactions (from_user_id, to_user_id, service_id, skillcoins_transferred) VALUES (?, ?, ?, ?)",
        [from_user_id, to_user_id, service_id, skillcoins_transferred]
      );
    }, "post to wallet");

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