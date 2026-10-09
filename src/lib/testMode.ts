/**
 * Server-controlled switch for the phone-OTP and DigiLocker mock flows. Both currently
 * fake instant success unconditionally, in every environment -- including a real prod
 * deploy, which is a real gap (a buyer could "verify" via DigiLocker with zero check).
 *
 * TEST_MODE only ever comes from a server-set env var, never a client toggle, and only
 * takes effect in local dev or on a Vercel preview deploy. Vercel builds every deploy with
 * NODE_ENV=production, so VERCEL_ENV is what tells preview apart from the live domain --
 * a leftover `TEST_MODE=true` can't silently fake-verify real users in production.
 */
export function isTestModeEnabled(): boolean {
  const allowedEnv = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  return process.env.NEXT_PUBLIC_TEST_MODE === "true" && allowedEnv;
}
