import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch all services
    const [services] = await pool.query('SELECT * FROM Services ORDER BY created_at DESC');
    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch services', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user_id, title, description, skillcoin_price, delivery_time } = await req.json();
    await pool.query(
      'INSERT INTO Services (user_id, title, description, skillcoin_price, delivery_time) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, description, skillcoin_price, delivery_time]
    );

    return NextResponse.json({ message: 'Service created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create service', error: error.message }, { status: 500 });
  }
}
