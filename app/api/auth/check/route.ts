import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

interface UserRow extends RowDataPacket {
  user_id: number
  name: string
  username: string
  email: string
  skillcoins: number
  created_at: Date
  updated_at: Date
  role: string
  status: string
  avatar_url: string
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
      'SELECT user_id, name, username, email, skillcoins, created_at, updated_at, role, status, avatar_url FROM Users WHERE user_id = ?',
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
        name: user.name,
        username: user.username,
        email: user.email,
        skillcoins: user.skillcoins,
        created_at: user.created_at,
        updated_at: user.updated_at,
        role: user.role,
        status: user.status,
        avatar_url: user.avatar_url
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
