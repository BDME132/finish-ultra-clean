import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "login_required" }, { status: 401 });
    }

    const origin =
      req.headers.get("origin") ??
      req.headers.get("referer")?.replace(/\/$/, "") ??
      "https://www.finishultra.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      // supabase_user_id flows through to the subscription metadata so the
      // webhook can set is_pro without needing a separate lookup table.
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${origin}/pheidi?upgraded=1`,
      cancel_url: `${origin}/pheidi`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
