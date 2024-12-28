import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, username, name } = await req.json();
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          name,
          avatar_url: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
          bio: "",
          skillcoins: 0,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
