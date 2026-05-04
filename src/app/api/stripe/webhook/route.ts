import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

async function setIsProForUser(userId: string, isPro: boolean) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, is_pro: isPro }, { onConflict: "id" });
  if (error) console.error(`[stripe/webhook] set is_pro=${isPro} for ${userId} failed:`, error);
}

async function setIsProForEmail(email: string, isPro: boolean): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("[stripe/webhook] listUsers failed:", error);
    return false;
  }
  const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!match) return false;
  await setIsProForUser(match.id, isPro);
  return true;
}

async function recordPendingProEmail(
  email: string,
  customerId: string | null,
  subscriptionId: string | null,
) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("pending_pro_emails")
    .upsert(
      {
        email: email.toLowerCase(),
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      },
      { onConflict: "email" },
    );
  if (error) console.error("[stripe/webhook] pending_pro_emails upsert failed:", error);
}

async function clearPendingProByCustomer(customerId: string) {
  const supabase = getSupabase();
  await supabase.from("pending_pro_emails").delete().eq("stripe_customer_id", customerId);
}

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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Fires for both anonymous and logged-in checkouts. Use this to capture the
  // email + customer id so we can claim the subscription later if no auth user
  // is associated yet.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email ??
      session.customer_email ??
      null;
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id ?? null;

    // Pull metadata from subscription if available (set in checkout/route.ts).
    let userId = (session.metadata?.supabase_user_id as string | undefined) ?? null;
    if (!userId && subscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        userId = (sub.metadata?.supabase_user_id as string | undefined) ?? null;
      } catch (err) {
        console.error("[stripe/webhook] subscriptions.retrieve failed:", err);
      }
    }

    if (userId) {
      await setIsProForUser(userId, true);
    } else if (email) {
      const matched = await setIsProForEmail(email, true);
      if (!matched) {
        await recordPendingProEmail(email, customerId, subscriptionId);
      }
    } else {
      console.warn("[stripe/webhook] checkout.session.completed — no email and no userId");
    }
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.supabase_user_id;
    if (userId) {
      await setIsProForUser(userId, true);
    }
    // Anonymous case is handled in checkout.session.completed (which has the email).
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.supabase_user_id;
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    if (userId) {
      await setIsProForUser(userId, false);
    } else {
      // Anonymous-purchaser cancellation: try to find by customer email.
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted && customer.email) {
          await setIsProForEmail(customer.email, false);
        }
      } catch (err) {
        console.error("[stripe/webhook] customers.retrieve failed:", err);
      }
    }
    await clearPendingProByCustomer(customerId);
  }

  return Response.json({ received: true });
}
