/**
 * Server-controlled switch for the phone-OTP and DigiLocker mock flows. Both currently
 * fake instant success unconditionally, in every environment -- including a real prod
 * deploy, which is a real gap (a buyer could "verify" via DigiLocker with zero check).
 *
 * TEST_MODE only ever comes from a server-set env var, never a client toggle, and is
 * hard-blocked outside development regardless of the var, so a leftover `TEST_MODE=true`
 * can't silently fake-verify real users in production.
 */
export function isTestModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true" && process.env.NODE_ENV !== "production";
}
