"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/ui/Buttons";
import { safeNextPath } from "@/lib/safe-redirect";

const LINK_ERROR_MESSAGE = "That sign-in link is invalid or has expired -- request a new one below.";

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "invalid_link" ? LINK_ERROR_MESSAGE : null
  );
  const next = safeNextPath(searchParams.get("next"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Never create a new account from this public form -- only a pre-provisioned
        // admin (created via the Supabase dashboard/API with app_metadata.role="admin")
        // can request a link. Otherwise this is an open account-creation + email-send
        // endpoint for any address. Found by /strix audit (2026-09-10).
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    });
    if (signInError) setError(signInError.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <p className="text-sm text-ink-soft">
        Check <b className="text-ink">{email}</b> for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[360px] flex-col gap-3">
      <label className="text-sm font-semibold" htmlFor="admin-email">
        Admin email
      </label>
      <input
        id="admin-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm"
        placeholder="you@aglaowner.in"
      />
      {error && <p className="text-sm text-oxide">{error}</p>}
      <SubmitButton type="submit">Send sign-in link</SubmitButton>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Admin sign-in</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
