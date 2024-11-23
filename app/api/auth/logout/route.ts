import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear the auth cookie
    response.cookies.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Setting expires to past date effectively deletes the cookie
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Error during logout' },
      { status: 500 }
    )
  }
}
