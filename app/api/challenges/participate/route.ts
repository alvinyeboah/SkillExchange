import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { challenge_id, user_id } = await req.json();
    const [existingParticipation] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM ChallengeParticipation WHERE challenge_id = ? AND user_id = ?',
      [challenge_id, user_id]
    );

    if (existingParticipation.length > 0) {
      return NextResponse.json({ message: 'User already participating in this challenge' }, { status: 400 });
    }
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO ChallengeParticipation (challenge_id, user_id, completed) VALUES (?, ?, ?)',
      [challenge_id, user_id, false]
    );

    return NextResponse.json({ message: 'User participation added successfully', participationId: result.insertId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to add participation', error: error.message }, { status: 500 });
  }
}
