"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/ui/Buttons";
import { safeNextPath } from "@/lib/safe-redirect";

const LINK_ERROR_MESSAGE = "That link is invalid or has expired -- request a new one.";

/** Maps raw Supabase auth errors to the same friendly copy shown in requirements/aglaowner-admin-login.html. */
function friendlyError(message: string): { text: string; variant: "error" | "warn" } {
  if (/invalid login credentials/i.test(message)) {
    return { text: "Incorrect email or password. Check your details and try again.", variant: "error" };
  }
  if (/rate limit/i.test(message)) {
    return {
      text: "Too many attempts. Sign-in is temporarily locked for this account -- try again in a few minutes, or reset your password.",
      variant: "warn",
    };
  }
  return { text: message, variant: "error" };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ text: string; variant: "error" | "warn" } | null>(
    searchParams.get("error") === "invalid_link" ? { text: LINK_ERROR_MESSAGE, variant: "error" } : null
  );
  const next = safeNextPath(searchParams.get("next"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(friendlyError(signInError.message));
      return;
    }
    router.push(next);
    router.refresh();
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
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm"
        placeholder="you@aglaowner.in"
      />
      <label className="text-sm font-semibold" htmlFor="admin-password">
        Password
      </label>
      <div className="relative">
        <input
          id="admin-password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full rounded-md border bg-paper px-3 py-2.5 pr-10 text-sm ${error ? "border-oxide bg-[#fbeeea]" : "border-line"}`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-soft"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "🙈" : "👁"}
        </button>
      </div>
      <div className="flex justify-end">
        <Link href="/admin/forgot-password" className="text-xs font-semibold text-navyblue hover:underline">
          Forgot password?
        </Link>
      </div>
      {error && <p className={`text-sm ${error.variant === "warn" ? "text-mustard-dark" : "text-oxide"}`}>{error.text}</p>}
      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </SubmitButton>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Admin sign-in</h1>
      <p className="text-center text-xs text-ink-soft">Access is provisioned by the project owner -- there is no self-service sign-up.</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
