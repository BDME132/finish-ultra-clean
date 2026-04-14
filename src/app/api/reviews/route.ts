import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

// GET — Fetch published reviews for a product (public, no auth required)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const sort = searchParams.get("sort") || "newest";

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const offset = (page - 1) * limit;

    // Build sort order
    let orderColumn = "created_at";
    let ascending = false;
    if (sort === "oldest") {
      orderColumn = "created_at";
      ascending = true;
    } else if (sort === "helpful") {
      orderColumn = "helpful_count";
      ascending = false;
    }

    // Fetch reviews with profile display names
    const { data: reviews, error, count } = await supabase
      .from("product_reviews")
      .select(
        "id, user_id, product_id, rating, title, body, race_context, miles_tested, helpful_count, status, created_at, updated_at, profiles(display_name)",
        { count: "exact" }
      )
      .eq("product_id", productId)
      .eq("status", "published")
      .order(orderColumn, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    // Fetch rating distribution
    const { data: allRatings, error: ratingsError } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("status", "published");

    if (ratingsError) {
      console.error("Error fetching rating distribution:", ratingsError);
      return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
    }

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    for (const r of allRatings ?? []) {
      ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
      ratingSum += r.rating;
    }
    const total = allRatings?.length ?? 0;
    const avgRating = total > 0 ? Math.round((ratingSum / total) * 10) / 10 : 0;

    // Flatten the profile join
    const formattedReviews = (reviews ?? []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      productId: r.product_id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      raceContext: r.race_context,
      milesTested: r.miles_tested,
      helpfulCount: r.helpful_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      displayName: r.profiles?.display_name || null,
    }));

    return NextResponse.json({
      reviews: formattedReviews,
      total,
      avgRating,
      ratingCounts,
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new review (auth required)
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, title, body: reviewBody, raceContext, milesTested } = body;

    if (!productId || !rating || !reviewBody) {
      return NextResponse.json({ error: "Missing required fields (productId, rating, body)" }, { status: 400 });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }

    if (reviewBody.length < 10) {
      return NextResponse.json({ error: "Review body must be at least 10 characters" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        title: title || null,
        body: reviewBody,
        race_context: raceContext || null,
        miles_tested: milesTested || null,
        status: "published",
      })
      .select("id, user_id, product_id, rating, title, body, race_context, miles_tested, helpful_count, created_at, updated_at")
      .single();

    if (error) {
      // Handle unique constraint violation (user already reviewed this product)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already reviewed this product" },
          { status: 409 }
        );
      }
      console.error("Error creating review:", error);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

    return NextResponse.json({
      review: {
        id: data.id,
        userId: data.user_id,
        productId: data.product_id,
        rating: data.rating,
        title: data.title,
        body: data.body,
        raceContext: data.race_context,
        milesTested: data.miles_tested,
        helpfulCount: data.helpful_count,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update an existing review (auth required, must be owner)
export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, rating, title, body: reviewBody, raceContext, milesTested } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return NextResponse.json({ error: "Rating must be an integer between 1 and 5" }, { status: 400 });
    }

    if (reviewBody !== undefined && reviewBody.length < 10) {
      return NextResponse.json({ error: "Review body must be at least 10 characters" }, { status: 400 });
    }

    // Build update payload with only provided fields
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (rating !== undefined) updates.rating = rating;
    if (title !== undefined) updates.title = title || null;
    if (reviewBody !== undefined) updates.body = reviewBody;
    if (raceContext !== undefined) updates.race_context = raceContext || null;
    if (milesTested !== undefined) updates.miles_tested = milesTested || null;

    const { data, error } = await supabase
      .from("product_reviews")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, user_id, product_id, rating, title, body, race_context, miles_tested, helpful_count, created_at, updated_at")
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Review not found or not owned by you" }, { status: 404 });
    }

    return NextResponse.json({
      review: {
        id: data.id,
        userId: data.user_id,
        productId: data.product_id,
        rating: data.rating,
        title: data.title,
        body: data.body,
        raceContext: data.race_context,
        milesTested: data.miles_tested,
        helpfulCount: data.helpful_count,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    console.error("Reviews PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete a review (auth required, must be owner)
export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reviews DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
