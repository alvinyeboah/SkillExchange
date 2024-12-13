import { NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";
import { validateRequest } from "@/lib/middleware/validateRequest";
import { z } from "zod";
import { RowDataPacket, OkPacket, FieldPacket } from 'mysql2';

interface ServiceRow extends RowDataPacket {
  service_id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  skillcoin_price: number;
  delivery_time: number;
  name: string | null;
  avatar_url: string | null;
}

type FormattedService = {
  service_id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  skillcoin_price: number;
  delivery_time: number;
  user: {
    name: string;
    avatar_url: string;
  };
};

const marketplaceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
});

export async function GET(req: Request): Promise<Response> {
  // const authResult = await authMiddleware(req);
  // if (authResult instanceof Response) return authResult;

  try {
    return await withConnection(pool, async (connection) => {
      const [services]: [ServiceRow[], FieldPacket[]] = await connection.query(
        `SELECT 
          s.*, 
          u.name, 
          u.avatar_url 
        FROM Services s
        JOIN Users u ON s.user_id = u.user_id
        ORDER BY s.created_at DESC`
      );

      // Format the services to include user object
      const formattedServices: FormattedService[] = services.map((service) => ({
        service_id: service.service_id,
        user_id: service.user_id,
        title: service.title,
        description: service.description,
        skillcoin_price: service.skillcoin_price,
        category: service.category,
        delivery_time: service.delivery_time,
        user: {
          name: service.name || "",
          avatar_url: service.avatar_url || "",
        },
      }));

      return NextResponse.json(formattedServices);
    });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  const roleResult = roleMiddleware(req, ["admin"]);
  if (roleResult instanceof Response) return roleResult;

  // Validate request
  const validationResult = await validateRequest(marketplaceSchema)(req);
  if (validationResult) return validationResult;

  try {
    return await withConnection(pool, async (connection) => {
      const body = await req.json();
      const [queryResult]: [OkPacket, FieldPacket[]] = await connection.query(
        "INSERT INTO marketplace (title, description, price) VALUES (?, ?, ?)",
        [body.title, body.description, body.price]
      );
      return NextResponse.json(queryResult);
    });
  } catch (error: any) {
    console.error("Error creating marketplace item:", error);
    return NextResponse.json(
      { message: "Failed to create marketplace item", error: error.message },
      { status: 500 }
    );
  }
}