import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// POST: Create a new service request
export async function POST(req: Request) {
  try {
    const { service_id, requester_id, provider_id, requirements } =
      await req.json();

    if (requester_id === provider_id) {
      return NextResponse.json(
        { message: "You cannot request a service from yourself" },
        { status: 400 }
      );
    }

    return await withConnection(async (connection) => {
      // Check for duplicate request
      const [existingRequest] = await connection.query<RowDataPacket[]>(
        "SELECT * FROM ServiceRequests WHERE service_id = ? AND requester_id = ? AND provider_id = ?",
        [service_id, requester_id, provider_id]
      );

      if (existingRequest.length > 0) {
        return NextResponse.json(
          { message: "You have already requested this service" },
          { status: 400 }
        );
      }

      // Insert new service request
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO ServiceRequests (service_id, requester_id, provider_id, requirements) VALUES (?, ?, ?, ?)",
        [service_id, requester_id, provider_id, requirements]
      );

      return NextResponse.json(
        {
          message: "Service request created successfully",
          requestId: result.insertId,
        },
        { status: 201 }
      );
    }, "create service request");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create service request", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Retrieve service requests

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const service_id = url.searchParams.get("service_id");
    const requester_id = url.searchParams.get("requester_id");
    const provider_id = url.searchParams.get("provider_id");

    return await withConnection(async (connection) => {
      let query = `
        SELECT 
          sr.request_id as id,
          s.title,
          s.description,
          sr.status,
          s.skillcoin_price as price
        FROM ServiceRequests sr
        JOIN Services s ON sr.service_id = s.service_id
      `;
      
      const params: (string | number)[] = [];
      const conditions: string[] = [];

      if (service_id) {
        conditions.push("sr.service_id = ?");
        params.push(service_id);
      }
      if (requester_id) {
        conditions.push("sr.requester_id = ?");
        params.push(requester_id);
      }
      if (provider_id) {
        conditions.push("sr.provider_id = ?");
        params.push(provider_id);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      const [rows] = await connection.query(query, params);
      return NextResponse.json(rows, { status: 200 });
    }, "retrieve service requests");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to retrieve service requests", error: error.message },
      { status: 500 }
    );
  }
}
