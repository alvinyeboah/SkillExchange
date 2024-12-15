import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const userId = params.id;

    return await withConnection(pool, async (connection) => {
      const [user] = await connection.query<RowDataPacket[]>(
        "SELECT user_id, username, name, email, avatar_url, skillcoins, created_at, bio FROM Users WHERE user_id = ?",
        [userId]
      );

      if (user.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user[0], { status: 200 });
    }, "get users");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { username, email, bio } = await req.json();
    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "UPDATE Users SET username = ?, email = ?, bio = ? WHERE user_id = ?",
        [username, email, bio, params.id]
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
    }, "put users");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
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
    }, "delete user");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { skillcoins_adjustment } = await req.json();
    return await withConnection(pool, async (connection) => {
      await connection.beginTransaction();

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
    }, "patch user");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update balance", error: error.message },
      { status: 500 }
    );
  }
}
