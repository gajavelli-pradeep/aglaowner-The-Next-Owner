import { createServiceRoleClient } from "@/lib/supabase/server";
import type { AdminStat, AdminActivityItem, AdminReferrer } from "@/types/admin";

interface ProfileRow {
  id: string;
  referral_code: string;
  phone: string | null;
}
interface ActivityRow {
  referrer_id: string;
  listing_id: string;
  credits: number;
  created_at: string;
}
interface ListingRow {
  id: string;
  ref: string;
  type: string;
}

const TYPE_LABELS: Record<string, string> = {
  business: "Business",
  equipment: "Equipment & assets",
  lease: "Space handover",
  inventory: "Inventory & stock",
};

/**
 * Admin-only read across every referrer's data -- profiles/referral_activity RLS only
 * lets a user read their own rows, so this always needs the service-role key. Only
 * ever called from admin/page.tsx, which proxy.ts already gates on app_metadata.role.
 */
export async function getAdminReferralOverview(): Promise<{ stats: AdminStat[]; activity: AdminActivityItem[]; referrers: AdminReferrer[] }> {
  const supabase = createServiceRoleClient();
  const [{ data: profileRows }, { data: activityRows }, { data: listingRows }, { data: tierRows }, { data: historyRows }] = await Promise.all([
    supabase.from("profiles").select("id, referral_code, phone").not("referral_code", "is", null),
    supabase.from("referral_activity").select("referrer_id, listing_id, credits, created_at").order("created_at", { ascending: false }),
    supabase.from("listings").select("id, ref, type"),
    supabase.from("reward_tiers").select("credits_threshold").order("credits_threshold", { ascending: false }).limit(1),
    supabase.from("reward_history").select("amount_paise"),
  ]);

  const profiles = (profileRows ?? []) as ProfileRow[];
  const activity = (activityRows ?? []) as ActivityRow[];
  const listingsById = new Map<string, ListingRow>((listingRows ?? []).map((l: ListingRow) => [l.id, l]));
  const cycleTarget = tierRows?.[0]?.credits_threshold ?? 50000;
  const voucherValuePaise = (historyRows ?? []).reduce((sum: number, r: { amount_paise: number }) => sum + r.amount_paise, 0);

  const activityByReferrer = new Map<string, ActivityRow[]>();
  for (const row of activity) {
    const list = activityByReferrer.get(row.referrer_id) ?? [];
    list.push(row);
    activityByReferrer.set(row.referrer_id, list);
  }

  const referrers: AdminReferrer[] = profiles.map((p) => {
    const rows = activityByReferrer.get(p.id) ?? [];
    const totalCredits = rows.reduce((sum, r) => sum + r.credits, 0);
    const referrals = rows.length;
    return {
      code: p.referral_code,
      mobile: p.phone ?? "--",
      referrals,
      cycleProgress: totalCredits % cycleTarget,
      cycleTarget,
      status: referrals > 0 ? "active" : "inactive",
      statusLabel: referrals > 0 ? "Active" : "No referrals yet",
    };
  });

  const now = new Date();
  const referralsThisMonth = activity.filter((r) => {
    const d = new Date(r.created_at);
    return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
  }).length;
  const creditsIssued = activity.reduce((sum, r) => sum + r.credits, 0);

  const stats: AdminStat[] = [
    { value: profiles.length.toLocaleString("en-IN"), label: "Total referrers" },
    { value: referralsThisMonth.toLocaleString("en-IN"), label: "Referrals this month" },
    { value: creditsIssued.toLocaleString("en-IN"), label: "Credits issued (all cycles)" },
    { value: `₹${Math.round(voucherValuePaise / 100).toLocaleString("en-IN")}`, label: "Voucher value redeemed" },
  ];

  const activityItems: AdminActivityItem[] = activity.slice(0, 5).map((row) => {
    const listing = listingsById.get(row.listing_id);
    const referrerCode = profiles.find((p) => p.id === row.referrer_id)?.referral_code ?? "--";
    return {
      listingRef: listing?.ref ?? "--",
      type: listing ? (TYPE_LABELS[listing.type] ?? listing.type) : "--",
      referrerCode,
      date: new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      credits: row.credits,
    };
  });

  return { stats, activity: activityItems, referrers };
}
