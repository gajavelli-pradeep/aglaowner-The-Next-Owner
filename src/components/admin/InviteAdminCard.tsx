"use client";

import { useState } from "react";
import { IconUserPlus } from "@tabler/icons-react";

/** Lets a signed-in admin invite a new admin by email -- the only account-creation path; /admin/login itself is password-only, never self-service. */
export function InviteAdminCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Something went wrong. Try again." }));
      setResult({ text: error, ok: false });
      return;
    }
    setResult({ text: `Invite sent to ${email}.`, ok: true });
    setEmail("");
  }

  return (
    <div className="mb-5 rounded-lg border border-line bg-paper p-[22px]">
      <h3 className="mb-1 flex items-center gap-2 text-[14.5px] font-semibold">
        <IconUserPlus size={17} stroke={1.75} /> Invite an admin
      </h3>
      <p className="mb-4 text-[12.5px] text-ink-soft">
        Sends a one-time magic link to set a password and sign in. Admin sign-in itself is always email + password -- this invite link is the only way a new admin account gets created.
      </p>
      <form onSubmit={handleSubmit} className="flex max-w-[420px] flex-wrap items-start gap-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="newadmin@aglaowner.in"
          className="min-w-[220px] flex-1 rounded-md border border-line bg-paper-2 px-3 py-2.5 text-[13px]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-ink px-4 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-[#3a4235] disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send invite"}
        </button>
      </form>
      {result && <p className={`mt-2.5 text-[12.5px] ${result.ok ? "text-stamp-green" : "text-oxide"}`}>{result.text}</p>}
    </div>
  );
}
