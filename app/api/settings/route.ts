import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export async function GET(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    const [settings] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM UserSettings WHERE user_id = ?",
      [userId]
    );

    if (settings.length === 0) {
      await pool.query(
        "INSERT INTO UserSettings (user_id) VALUES (?)",
        [userId]
      );
      const [newSettings] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM UserSettings WHERE user_id = ?",
        [userId]
      );
      return NextResponse.json(newSettings[0], { status: 200 });
    }

    return NextResponse.json(settings[0], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch settings", error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function PUT(req: Request) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof Response) return authResult;

  try {
    const {
      userId,
      emailNotifications,
      pushNotifications,
      smsNotifications,
      notificationFrequency,
      language,
      profileVisibility,
      showOnlineStatus,
      allowMessagesFromStrangers,
      dataUsageConsent
    } = await req.json();

    // Update user settings
    await pool.query(
      `UPDATE UserSettings SET 
        email_notifications = ?,
        push_notifications = ?,
        sms_notifications = ?,
        notification_frequency = ?,
        language = ?,
        profile_visibility = ?,
        show_online_status = ?,
        allow_messages_from_strangers = ?,
        data_usage_consent = ?
      WHERE user_id = ?`,
      [
        emailNotifications,
        pushNotifications,
        smsNotifications,
        notificationFrequency,
        language,
        profileVisibility,
        showOnlineStatus,
        allowMessagesFromStrangers,
        dataUsageConsent,
        userId
      ]
    );

    return NextResponse.json(
      { message: "Settings updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update settings", error: error.message },
      { status: 500 }
    );
  }
}
