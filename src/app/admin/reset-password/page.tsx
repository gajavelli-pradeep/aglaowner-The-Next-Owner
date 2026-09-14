"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/ui/Buttons";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-xl font-semibold">Set a new password</h1>
      <form onSubmit={handleSubmit} className="flex w-full max-w-[360px] flex-col gap-3">
        <label className="text-sm font-semibold" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm"
          placeholder="At least 8 characters"
        />
        <label className="text-sm font-semibold" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm"
          placeholder="Retype the password"
        />
        {error && <p className="text-sm text-oxide">{error}</p>}
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save password"}
        </SubmitButton>
      </form>
    </div>
  );
}
