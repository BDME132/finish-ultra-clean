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

    const supabase = getSupabase();

    // Fetch dashboard data in parallel
    const [
      { data: subscribers, error: subscribersError },
      { data: newsletters, error: newslettersError },
    ] = await Promise.all([
      supabase
        .from("email_signups")
        .select("id, email, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("newsletters")
        .select("id, subject, body, sent_at, recipient_count")
        .order("sent_at", { ascending: false })
        .limit(10),
    ]);

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    if (newslettersError) {
      console.error("Error fetching newsletters:", newslettersError);
      return NextResponse.json(
        { error: "Failed to fetch newsletters" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribers: subscribers || [],
      newsletters: newsletters || [],
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
