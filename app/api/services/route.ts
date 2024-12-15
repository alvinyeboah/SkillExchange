import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const {
      user_id,
      title,
      description,
      skillcoin_price,
      delivery_time,
      tags,
      requirements,
      revisions,
    } = await req.json();

    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO Services (user_id, title, description, skillcoin_price, delivery_time, tags, requirements, revisions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user_id,
          title,
          description,
          skillcoin_price,
          delivery_time,
          JSON.stringify(tags),
          requirements,
          revisions,
        ]
      );

      return NextResponse.json(
        { message: "Service created successfully", serviceId: result.insertId },
        { status: 201 }
      );
    }, " service posting");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 }
    );
  }
}
