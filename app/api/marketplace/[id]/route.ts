import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Service } from "@/types/service";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const serviceId = params.id;

    return await withConnection(pool, async (connection) => {
      const [service] = await connection.query<RowDataPacket[]>(
        `SELECT Services.*, Users.user_id, Users.name, Users.email, Users.avatar_url 
         FROM Services 
         LEFT JOIN Users ON Services.user_id = Users.user_id 
         WHERE service_id = ?`,
        [serviceId]
      );

      if (!Array.isArray(service) || service.length === 0) {
        return NextResponse.json(
          { message: "Service not found" },
          { status: 404 }
        );
      }

      const serviceData = {
        ...service[0],
        user: {
          user_id: service[0].user_id,
          name: service[0].name,
          email: service[0].email,
          avatar_url: service[0].avatar_url
        }
      };

      return NextResponse.json(serviceData as Service & { user: any }, { status: 200 });
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch service", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { title, description, skillcoin_price, delivery_time } =
      await request.json();

    return await withConnection(pool, async (connection) => {
      // Update the service in the database
      await connection.query(
        "UPDATE Services SET title = ?, description = ?, skillcoin_price = ?, delivery_time = ? WHERE service_id = ?",
        [title, description, skillcoin_price, delivery_time, params.id]
      );

      return NextResponse.json(
        { message: "Service updated successfully" },
        { status: 200 }
      );
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update service", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    return await withConnection(pool, async (connection) => {
      // Delete the service from the database
      await connection.query("DELETE FROM Services WHERE service_id = ?", [params.id]);

      return NextResponse.json(
        { message: "Service deleted successfully" },
        { status: 200 }
      );
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete service", error: error.message },
      { status: 500 }
    );
  }
}