import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [user] = await pool.query<RowDataPacket[]>(
      "SELECT user_id, username, email, skillcoins, created_at FROM Users WHERE user_id = ?",
      [params.id]
    );

    if (user.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { username, email } = await req.json();
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE Users SET username = ?, email = ? WHERE user_id = ?",
      [username, email, params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "User not found or no changes made" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Users WHERE user_id = ?",
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { skillcoins_adjustment } = await req.json();
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user's skillcoins
      const [result] = await connection.query<ResultSetHeader>(
        "UPDATE Users SET skillcoins = skillcoins + ? WHERE user_id = ?",
        [skillcoins_adjustment, params.id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      await connection.commit();
      return NextResponse.json(
        { message: "Balance updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update balance", error: error.message },
      { status: 500 }
    );
  }
}
