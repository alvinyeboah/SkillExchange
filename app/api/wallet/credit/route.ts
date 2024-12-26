import { NextResponse } from "next/server";
import { withConnection } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, amount, reference, transactionId } = await req.json();

    await withConnection(async (connection) => {
      // Start transaction
      await connection.beginTransaction();

      try {
        // Insert payment record
        await connection.query(
          `INSERT INTO PaymentTransactions (user_id, amount, reference, transaction_id, status)
           VALUES (?, ?, ?, ?, 'completed')`,
          [userId, amount, reference, transactionId]
        );

        // Update user's wallet balance
        await connection.query(
          `UPDATE Users SET skillcoins = skillcoins + ? WHERE user_id = ?`,
          [amount, userId]
        );

        // Insert wallet transaction record
        // prpblem here
        await connection.query(
          `INSERT INTO Transactions (from_user_id, to_user_id,service_id, skillcoins_transferred, description, type)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [0, userId, 0, amount, 'Wallet top-up', 'Purchased']
        );

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }, "credit wallet");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to credit wallet", error: error.message },
      { status: 500 }
    );
  }
} 