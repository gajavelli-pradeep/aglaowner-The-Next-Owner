import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay-webhook";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Razorpay webhook -- the one place in the app allowed to move a listing from
 * draft to active (see requirements/AUDIT.md and the write-flow diagram in
 * aglaowner-data-architecture.html section 03). Update the webhook URL in
 * Razorpay's dashboard to point here, not the bare domain root.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed, not open: if the secret isn't configured, refuse to process
    // anything rather than silently accepting unverified webhook calls.
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpaySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (event.event !== "payment.captured") {
    // Ack anything else (payment.failed, order.paid, etc.) without acting on it --
    // Razorpay retries on non-2xx, and there's nothing to do for these yet.
    return NextResponse.json({ received: true, handled: false });
  }

  const orderId = event.payload?.payment?.entity?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "missing order_id" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data: activated, error } = await supabase.rpc("activate_listing_from_payment", {
    p_provider_ref: orderId,
  });

  if (error) {
    // A real DB error -- ask Razorpay to retry.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // activated === false means no matching pending payment was found for this order_id
  // (e.g. a test webhook fired from the Razorpay dashboard for an order this app never
  // created) -- not an error, just nothing to do. Still 200 so Razorpay doesn't retry.
  return NextResponse.json({ received: true, handled: Boolean(activated) });
}
