import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// Next.js App Router delivers the raw body via req.text() — no special config needed.
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.supabase_user_id;

    if (userId) {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, is_pro: true }, { onConflict: "id" });
      if (error) console.error("[stripe/webhook] set is_pro=true failed:", error);
    } else {
      console.warn("[stripe/webhook] subscription.created — no supabase_user_id in metadata");
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.supabase_user_id;

    if (userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ is_pro: false })
        .eq("id", userId);
      if (error) console.error("[stripe/webhook] set is_pro=false failed:", error);
    }
  }

  return Response.json({ received: true });
}
