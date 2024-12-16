import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";

export async function GET(req: Request, props: { params: { id: string } }) {
  try {
    const id = props.params.id;

    return await withConnection(async (connection) => {
      const [userRows]: [RowDataPacket[], FieldPacket[]] =
        await connection.query(
          `SELECT 
          user_id, 
          username, 
          name, 
          email, 
          avatar_url, 
          skillcoins, 
          created_at, 
          bio 
        FROM Users 
        WHERE user_id = ?`,
          [id]
        );

      if (!userRows[0]) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Get weekly skillcoins
      const [weeklySkillcoins]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        `SELECT COALESCE(SUM(skillcoins), 0) as total 
         FROM Users 
         WHERE user_id = ? 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)`,
        [id]
      );

      // Get active services count
      const [activeServices]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        `SELECT COUNT(*) as count 
         FROM Services 
         WHERE user_id = ? AND status = 'active'`,
        [id]
      );

      // Get completed challenges count
      const [completedChallenges]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        `SELECT COUNT(*) as count 
         FROM ChallengeParticipation 
         WHERE user_id = ? AND progress = 100`,
        [id]
      );

      const userData = {
        ...userRows[0],
        skillcoins_earned_this_week: weeklySkillcoins[0]?.total || 0,
        active_services: activeServices[0]?.count || 0,
        completed_challenges: completedChallenges[0]?.count || 0,
      };

      return NextResponse.json(userData, { status: 200 });
    }, "get user stats");
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
    return await withConnection(async (connection) => {
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
    return await withConnection(async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "DELETE FROM Users WHERE user_id = ?",
        [params.id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
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
    return await withConnection(async (connection) => {
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
