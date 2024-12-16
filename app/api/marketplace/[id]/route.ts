import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Service } from "@/types/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json(
        { message: "user_id is required" },
        { status: 400 }
      );
    }
    return await withConnection(async (connection) => {
      const [services] = await connection.query<RowDataPacket[]>(
        `SELECT S.*, U.name, U.email, U.avatar_url
FROM Services S
WHERE S.user_id = ?;
`,
        [user_id]
      );

      if (!Array.isArray(services) || services.length === 0) {
        return NextResponse.json(
          { message: "No services found for this user" },
          { status: 404 }
        );
      }

      const servicesData = services.map((service) => ({
        ...service,
        user: {
          name: service.name,
          avatar_url: service.avatar_url,
        },
      }));

      return NextResponse.json(servicesData, {
        status: 200,
      });
    }, "get services by user");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch services", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { title, description, skillcoin_price, delivery_time } =
      await request.json();

    return await withConnection(async (connection) => {
      // Update the service in the database
      await connection.query(
        "UPDATE Services SET title = ?, description = ?, skillcoin_price = ?, delivery_time = ? WHERE service_id = ?",
        [title, description, skillcoin_price, delivery_time, params.id]
      );

      return NextResponse.json(
        { message: "Service updated successfully" },
        { status: 200 }
      );
    }, "Service put ");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update service", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    return await withConnection(async (connection) => {
      // Delete the service from the database
      await connection.query("DELETE FROM Services WHERE service_id = ?", [
        params.id,
      ]);

      return NextResponse.json(
        { message: "Service deleted successfully" },
        { status: 200 }
      );
    }, "Service deleted successfully");
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete service", error: error.message },
      { status: 500 }
    );
  }
}
