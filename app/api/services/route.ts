import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const [services] = await pool.query(
      "SELECT * FROM Services ORDER BY created_at DESC"
    );
    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch services", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {

  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  try {
    const { user_id, title, description, skillcoin_price, delivery_time } =
      await req.json();
    await pool.query(
      "INSERT INTO Services (user_id, title, description, skillcoin_price, delivery_time) VALUES (?, ?, ?, ?, ?)",
      [user_id, title, description, skillcoin_price, delivery_time]
    );

    return NextResponse.json(
      { message: "Service created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 }
    );
  }
}
