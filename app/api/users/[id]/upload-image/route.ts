import { NextRequest, NextResponse } from "next/server";
import pool, { withConnection } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

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

    return await withConnection(async (connection) => {
      // Update database with new avatar URL
      await connection.query(
        "UPDATE Users SET avatar_url = ? WHERE user_id = ?",
        [avatar_url, params.id]
      );

      return NextResponse.json({
        message: "Image uploaded successfully",
        avatar_url,
      });
    }, "uploading user image");
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload image", error: error.message },
      { status: 500 }
    );
  }
}
