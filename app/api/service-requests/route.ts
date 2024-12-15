import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { service_id, requester_id, provider_id, requirements } = await req.json();

    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO ServiceRequests (service_id, requester_id, provider_id, requirements) VALUES (?, ?, ?, ?)",
        [service_id, requester_id, provider_id, requirements]
      );

      return NextResponse.json({ message: "Service request created successfully", requestId: result.insertId }, { status: 201 });
    }, "create service request");
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create service request", error: error.message }, { status: 500 });
  }
} 