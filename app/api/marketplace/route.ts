import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { roleMiddleware } from "@/lib/middleware/roleMiddleware";

// Define types for better type safety
type Service = {
  service_id:any;
  user_id: number;
  title: string;
  description: string;
  category:string;
  skillcoin_price: number;
  delivery_time: number;
  name?: string;  // From Users table
  avatar_url?: string;  // From Users table
};

type FormattedService = Omit<Service, 'name' | 'avatar_url'> & {
  user: {
    name: string;
    avatar_url: string;
  };
};

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const [services]: [ any,any] = await pool.query(
      `SELECT 
        s.*, 
        u.name, 
        u.avatar_url 
      FROM Services s
      JOIN Users u ON s.user_id = u.user_id
      ORDER BY s.created_at DESC`
    );

    // Format the services to include user object
    const formattedServices: FormattedService[] = services.map((service:any) => ({
      service_id: service.service_id,
      user_id: service.user_id,
      title: service.title,
      description: service.description,
      skillcoin_price: service.skillcoin_price,
      category:service.category,
      delivery_time: service.delivery_time,
      user: {
        name: service.name || '',  // Provide default values
        avatar_url: service.avatar_url || ''
      }
    }));

    return NextResponse.json(formattedServices, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching services:', error);
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

    const [result] = await pool.query(
      "INSERT INTO Services (user_id, title, description, skillcoin_price, delivery_time) VALUES (?, ?, ?, ?, ?)",
      [user_id, title, description, skillcoin_price, delivery_time]
    );

    return NextResponse.json(
      { message: "Service created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 }
    );
  }
}