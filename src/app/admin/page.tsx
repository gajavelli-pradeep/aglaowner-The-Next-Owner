import { AdminApp } from "@/components/admin/AdminApp";
import { createClient } from "@/lib/supabase/server";
import { LISTING_TYPES } from "@/lib/data/listing-types";
import { listingTypeSettings as fallbackListingTypeSettings } from "@/data/admin";
import type { ListingTypeSetting } from "@/types/admin";

interface ListingTypeSettingsRow {
  type: string;
  active_days: number;
  archive_days: number;
  listing_fee_paise: number;
  reactivation_fee_paise: number;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ data: userData }, { data: settingsRows }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("listing_type_settings").select("type, active_days, archive_days, listing_fee_paise, reactivation_fee_paise"),
  ]);

  const byType = new Map<string, ListingTypeSettingsRow>((settingsRows ?? []).map((row: ListingTypeSettingsRow) => [row.type, row]));
  const listingTypeSettings: ListingTypeSetting[] = LISTING_TYPES.map(({ dbType, label }) => {
    const row = byType.get(dbType);
    const fallback = fallbackListingTypeSettings.find((s) => s.type === label);
    return {
      type: label,
      activeDays: row?.active_days ?? fallback?.activeDays ?? 0,
      archiveDays: row?.archive_days ?? fallback?.archiveDays ?? 0,
      listingFee: row ? Math.round(row.listing_fee_paise / 100) : (fallback?.listingFee ?? 0),
      reactivationFee: row ? Math.round(row.reactivation_fee_paise / 100) : (fallback?.reactivationFee ?? 0),
    };
  });

  return <AdminApp adminEmail={userData.user?.email ?? ""} listingTypeSettings={listingTypeSettings} />;
}
