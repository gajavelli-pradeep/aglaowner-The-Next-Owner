-- Fixes a dual-source-of-truth bug flagged this session: every admin-write RLS policy
-- checked `profiles.role = 'admin'`, but the app's actual authorization source is the
-- JWT `app_metadata.role` claim (checked in proxy.ts and every /api/admin/* route via
-- requireAdmin()). Harmless so far because every admin write goes through the
-- service-role key (bypasses RLS entirely) -- but these 8 policies would silently
-- reject a legitimate admin, or silently accept a stale one, the moment any
-- client-side write to these tables is ever added, since profiles.role is never kept
-- in sync with app_metadata.role.
--
-- Fix: check the JWT claim directly -- one source of truth, matching the app's real
-- authorization model, instead of trying to keep two columns in sync.

drop policy "admins write categories" on public.categories;
create policy "admins write categories"
  on public.categories for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins update categories" on public.categories;
create policy "admins update categories"
  on public.categories for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins delete categories" on public.categories;
create policy "admins delete categories"
  on public.categories for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins write credit rules" on public.credit_rules;
create policy "admins write credit rules"
  on public.credit_rules for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins write reward tiers" on public.reward_tiers;
create policy "admins write reward tiers"
  on public.reward_tiers for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins write promotions" on public.promotions;
create policy "admins write promotions"
  on public.promotions for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins manage voucher providers" on public.voucher_providers;
create policy "admins manage voucher providers"
  on public.voucher_providers for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy "admins write listing type settings" on public.listing_type_settings;
create policy "admins write listing type settings"
  on public.listing_type_settings for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
