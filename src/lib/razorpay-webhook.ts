import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verifies a Razorpay webhook's X-Razorpay-Signature header against the raw request
 * body, per https://razorpay.com/docs/webhooks/validate-test/ -- HMAC-SHA256 keyed
 * with the webhook secret, over the *raw* body text (never a re-stringified parsed
 * object, since whitespace differences would break the match).
 *
 * Uses Node's built-in crypto rather than the `razorpay` npm package -- this is a
 * one-function need, the stdlib already covers it.
 */
export function verifyRazorpaySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(signatureHeader, "hex");

  // Different lengths would throw inside timingSafeEqual -- treat as a mismatch, not a crash.
  if (expectedBuf.length !== receivedBuf.length) return false;

  return timingSafeEqual(expectedBuf, receivedBuf);
}
