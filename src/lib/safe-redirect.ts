/** Only allow same-origin relative redirects -- blocks //evil.com and /\evil.com open-redirect tricks. */
export function safeNextPath(next: string | null, fallback = "/admin"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.startsWith("/\\")) return fallback;
  return next;
}
