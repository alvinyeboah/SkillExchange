import { NextRequest, NextResponse } from 'next/server';
import pool, { withConnection } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authMiddleware } from '@/lib/middleware/authMiddleware';

function formatDateForMySQL(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace('T', ' '); // Converts to 'YYYY-MM-DD HH:MM:SS'
}

// GET /api/reminders
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    return await withConnection(pool, async (connection) => {
      const [reminders] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Reminders WHERE user_id = ? ORDER BY datetime ASC`,
        [userId]
      );

      return NextResponse.json(reminders);
    }, "Reminders Get");
  } catch (error: any) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reminders', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/reminders
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof Response) return authResult;

    const { userId, type, referenceId, title, datetime } = await req.json();
    const formattedDatetime = formatDateForMySQL(datetime);

    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO Reminders (user_id, type, reference_id, title, datetime, notified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, type, referenceId, title, formattedDatetime, false] // Set notified to false by default
      );

      const [newReminder] = await connection.query<RowDataPacket[]>(
        'SELECT * FROM Reminders WHERE id = ?',
        [result.insertId]
      );

      return NextResponse.json(newReminder[0], { status: 201 });
    }, "Reminders Post");
  } catch (error: any) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { message: 'Failed to create reminder', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/:id
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof Response) return authResult;

    const { id } = await req.json();

    return await withConnection(pool, async (connection) => {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM Reminders WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Reminder not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Reminder deleted successfully' }, { status: 200 });
    }, "delete reminder");
  } catch (error: any) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { message: 'Failed to delete reminder', error: error.message },
      { status: 500 }
    );
  }
}
