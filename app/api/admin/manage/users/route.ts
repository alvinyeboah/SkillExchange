import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT user_id, username, email, avatar_url, skillcoins, created_at FROM Users ORDER BY created_at DESC"
    );

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  try {
    const { user_id } = await req.json();

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM Users WHERE user_id = ?",
      [user_id]
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
