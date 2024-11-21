import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;
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
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;
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
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;
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
