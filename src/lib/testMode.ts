/**
 * Switch for the demo phone-OTP and DigiLocker flows, so the client can walk the real screens
 * before an SMS provider and DigiLocker are connected. Neither demo writes to the database --
 * they only move the UI to its next step -- and every gated screen shows a "Test mode" badge.
 *
 * Driven only by NEXT_PUBLIC_TEST_MODE, scoped per Vercel environment. While it's on, anyone
 * can "verify" with DEMO_OTP, so it must be off (unset) before real users arrive.
 * ponytail: client-side demo only; real OTP/DigiLocker verification has to happen server-side.
 */
export const DEMO_OTP = "123456";

export function isTestModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true";
}
