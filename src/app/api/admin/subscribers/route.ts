import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { SubscribersResponse } from "@/types/newsletter";

export async function GET(): Promise<NextResponse<SubscribersResponse>> {
  try {
    // Verify admin access via session cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch subscribers using service key
    const { data: subscribers, error } = await getSupabase()
      .from("email_signups")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscribers:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribers: subscribers || [],
      count: subscribers?.length || 0,
    });
  } catch (error) {
    console.error("Error in subscribers route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
