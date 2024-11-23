import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

interface UserRow extends RowDataPacket {
  user_id: number
  email: string
  username: string
  role: string
  skillcoins: number
  created_at: Date
}

export async function GET(req: NextRequest) {
  try {
    const authToken = req.cookies.get('authToken')?.value
    
    if (!authToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const payload = verifyToken(authToken)
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const [users] = await pool.query<UserRow[]>(
      'SELECT user_id, email, username, role, skillcoins, created_at FROM Users WHERE user_id = ?',
      [payload.userId]
    ) as [UserRow[], any]

    if (!users || users.length === 0) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const user = users[0]
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username,
        role: user.role,
        skillcoins: user.skillcoins,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
