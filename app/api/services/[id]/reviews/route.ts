import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    // Fetch reviews for the specified service
    const [reviews] = await pool.query<RowDataPacket[]>(
      `
      SELECT Ratings.rating_id, Ratings.rating_value, Ratings.review, Ratings.created_at,
             Users.username
      FROM Ratings
      INNER JOIN Users ON Ratings.user_id = Users.user_id
      WHERE Ratings.service_id = ?
      ORDER BY Ratings.created_at DESC
      `,
      [params.id]
    );

    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch reviews", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const { user_id, rating_value, review } = await req.json();

    // Validate rating value
    if (rating_value < 1 || rating_value > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Insert the new review into the database
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO Ratings (service_id, user_id, rating_value, review) VALUES (?, ?, ?, ?)",
      [params.id, user_id, rating_value, review]
    );

    return NextResponse.json(
      { message: "Review added successfully", reviewId: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add review", error: error.message },
      { status: 500 }
    );
  }
}
