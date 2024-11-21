import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    // Fetch all transactions
    const [transactions] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM Transactions ORDER BY transaction_date DESC'
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch transactions', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { from_user_id, to_user_id, service_id, skillcoins_transferred } = await req.json();

    // Insert a new transaction
    await pool.query(
      'INSERT INTO Transactions (from_user_id, to_user_id, service_id, skillcoins_transferred) VALUES (?, ?, ?, ?)',
      [from_user_id, to_user_id, service_id, skillcoins_transferred]
    );

    return NextResponse.json({ message: 'Transaction created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create transaction', error: error.message }, { status: 500 });
  }
}
