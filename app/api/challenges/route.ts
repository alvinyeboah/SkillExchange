import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    // Fetch all challenges
    const [challenges] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM Challenges ORDER BY start_date DESC'
    );

    return NextResponse.json(challenges, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch challenges', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, reward_skillcoins, start_date, end_date } = await req.json();

    // Create a new challenge
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO Challenges (title, description, reward_skillcoins, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [title, description, reward_skillcoins, start_date, end_date]
    );

    return NextResponse.json({ message: 'Challenge created successfully', challengeId: result.insertId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create challenge', error: error.message }, { status: 500 });
  }
}
