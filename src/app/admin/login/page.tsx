"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/ui/Buttons";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const next = useSearchParams().get("next") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}` },
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
