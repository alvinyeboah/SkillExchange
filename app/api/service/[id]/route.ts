import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Service } from '@/types/service';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const [service] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM Services WHERE service_id = ?',
        [params.id]
      );
  
      if (service.length === 0) {
        return NextResponse.json({ message: 'Service not found' }, { status: 404 });
      }
  
      return NextResponse.json(service[0] as Service, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to fetch service', error: error.message }, { status: 500 });
    }
  }

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { title, description, skillcoin_price, delivery_time } = await req.json();

    // Update the service in the database
    await pool.query(
      'UPDATE Services SET title = ?, description = ?, skillcoin_price = ?, delivery_time = ? WHERE service_id = ?',
      [title, description, skillcoin_price, delivery_time, params.id]
    );

    return NextResponse.json({ message: 'Service updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update service', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Delete the service from the database
    await pool.query('DELETE FROM Services WHERE service_id = ?', [params.id]);

    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete service', error: error.message }, { status: 500 });
  }
}
