import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createSupabaseServer } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    if (!priceId) {
      console.error("[stripe/checkout] NEXT_PUBLIC_STRIPE_PRICE_ID not set");
      return Response.json({ error: "stripe_not_configured" }, { status: 500 });
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const origin =
      req.headers.get("origin") ??
      req.headers.get("referer")?.replace(/\/$/, "") ??
      "https://www.finishultra.com";

    // Logged-in users: pass supabase_user_id so webhook can flip is_pro.
    // Anonymous users: let Stripe collect email; webhook will match by email
    // when they sign up afterward.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      ...(user
        ? {
            customer_email: user.email,
            subscription_data: { metadata: { supabase_user_id: user.id } },
          }
        : {}),
      success_url: `${origin}/pheidi?upgraded=1`,
      cancel_url: `${origin}/pheidi`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    return Response.json({ error: message }, { status: 500 });
  }
}
