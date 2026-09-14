"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/ui/Buttons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error: message } = await res.json().catch(() => ({ error: "Something went wrong. Try again." }));
      setError(message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Reset password</h1>
      {sent ? (
        <p className="text-center text-sm text-stamp-green">
          Reset link sent. Check <b className="text-ink">{email}</b> for instructions -- the link expires in 30 minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-[360px] flex-col gap-3">
          <label className="text-sm font-semibold" htmlFor="reset-email">
            Admin email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`rounded-md border bg-paper px-3 py-2.5 text-sm ${error ? "border-oxide bg-[#fbeeea]" : "border-line"}`}
            placeholder="you@aglaowner.in"
          />
          {error && <p className="text-sm text-oxide">{error}</p>}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </SubmitButton>
        </form>
      )}
      <Link href="/admin/login" className="text-xs font-semibold text-navyblue hover:underline">
        Back to sign-in
      </Link>
    </div>
  );
}
