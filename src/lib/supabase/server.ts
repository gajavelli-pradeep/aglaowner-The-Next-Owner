import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Server Components / Server Actions / Route Handlers only — never import from a "use client" file. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            );
          } catch {
            // Called from a Server Component with no response to write cookies to —
            // safe to ignore as long as proxy.ts refreshes the session on every request.
          }
        },
      },
    }
  );
}

/**
 * Plain, cookie-free client for public/anonymous reads (e.g. the pricing section) that
 * must stay statically cacheable. createClient() above calls cookies(), which opts the
 * whole page into dynamic rendering per-request -- verified via `next build`: adding it
 * flipped "/" from Static to Dynamic the moment Supabase env vars were set. Use this one
 * whenever the read doesn't need the caller's session.
 */
export function createAnonClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

/** Service-role client — bypasses RLS entirely. Only for trusted server code (payment webhooks). Never import from a client file. */
export function createServiceRoleClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
