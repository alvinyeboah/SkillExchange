import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to Cloudinary
    const avatar_url = await uploadToCloudinary(buffer);
    
    // Update database with new avatar URL
    await pool.query(
      "UPDATE Users SET avatar_url = ? WHERE user_id = ?",
      [avatar_url, params.id]
    );

    return NextResponse.json({ 
      message: "Image uploaded successfully",
      avatar_url
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: "Failed to upload image", error: error.message },
      { status: 500 }
    );
  }
}
