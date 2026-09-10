-- aglaowner initial schema — mirrors aglaowner-data-architecture.html
-- Ref: requirements/AUDIT.md (RLS-gap fixes), skill supabase-postgres-best-practices

-- ============================================================
-- SHARED SPINE
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text unique,
  is_seller boolean not null default false,
  is_referrer boolean not null default false,
  referral_code text unique,
  digilocker_verified_at timestamptz,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Every table FKs to profiles.id and every role check reads from it, so a signup with
-- no matching profiles row breaks the first write and silently fails every role check.
-- Found by /strix audit (2026-09-10) -- no such trigger existed until now.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role = 'user'); -- role is never self-assignable

-- A permissive SELECT policy here would expose every column (phone, digilocker_verified_at,
-- role) for any row it matches — RLS controls rows, not columns. Referral-code lookup
-- needs only that one column, so it's a narrow view instead (security_invoker so the
-- view still runs under the caller's own RLS, not the view owner's).
create view public.referral_codes_public
  with (security_invoker = true) as
  select referral_code from public.profiles where referral_code is not null;

grant select on public.referral_codes_public to anon, authenticated;

-- ============================================================
-- MARKETPLACE
-- ============================================================

create table public.categories (
  slug text primary key,
  name text not null,
  icon text not null,
  hint text not null,
  sort_order int not null default 0
);

alter table public.categories enable row level security;

create policy "anyone reads categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "admins write categories"
  on public.categories for insert
  to authenticated
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admins update categories"
  on public.categories for update
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admins delete categories"
  on public.categories for delete
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  ref text not null unique,
  type text not null check (type in ('business', 'equipment', 'lease', 'inventory')),
  category_slug text references public.categories (slug),
  title text not null,
  description text not null,
  city text not null,
  locality text not null,
  price_band text not null,
  turnover_band text,
  years_band text,
  reason text not null,
  debt_note text,
  referral_code_used text references public.profiles (referral_code),
  parent_listing_id uuid references public.listings (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived', 'deleted')),
  active_until timestamptz,
  archive_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_owner_id_idx on public.listings (owner_id);
create index listings_category_slug_idx on public.listings (category_slug);
create index listings_active_idx on public.listings (status) where status = 'active';

alter table public.listings enable row level security;

create policy "anyone reads active listings"
  on public.listings for select
  to anon, authenticated
  using (status = 'active');

create policy "owners read own listings in any state"
  on public.listings for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "owners edit own listing content"
  on public.listings for all
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

-- status/active_until/archive_until are set only by this trigger, which runs as the
-- table owner and is the sole path from the payment webhook's service-role UPDATE to
-- a live listing. The blanket owner policy above would otherwise let a seller flip
-- status='active' without ever paying — see requirements/AUDIT.md finding #1.
create function public.guard_listing_status_columns()
returns trigger as $$
begin
  if (new.status, new.active_until, new.archive_until)
      is distinct from (old.status, old.active_until, old.archive_until)
     and auth.role() <> 'service_role' then
    raise exception 'status/timers are set by payment confirmation only';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger lock_listing_status
  before update on public.listings
  for each row execute function public.guard_listing_status_columns();

-- the HTML prototype only checked this client-side (sellRefError) — promoted to a
-- trigger so a direct API call can't bypass it. See AUDIT.md finding #2.
create function public.guard_no_self_referral()
returns trigger as $$
begin
  if new.referral_code_used is not null
     and new.referral_code_used = (select referral_code from public.profiles where id = new.owner_id) then
    raise exception 'referrers cannot use their own code on their own listing';
  end if;
  return new;
end;
$$ language plpgsql security invoker set search_path = public;

create trigger no_self_referral
  before insert or update on public.listings
  for each row execute function public.guard_no_self_referral();

create table public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  kind text not null check (kind in ('image', 'video')),
  is_cover boolean not null default false,
  sort_order int not null default 0
);

create index listing_media_listing_id_idx on public.listing_media (listing_id);

alter table public.listing_media enable row level security;

create policy "anyone reads media for active listings"
  on public.listing_media for select
  to anon, authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.status = 'active'));

create policy "owners manage own listing media"
  on public.listing_media for all
  to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()));

create table public.connect_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.connect_requests enable row level security;

create policy "buyers see own connect requests"
  on public.connect_requests for select
  to authenticated
  using ((select auth.uid()) = buyer_id);

-- inserts only ever happen via reveal_seller_contact() (security definer) — no direct insert policy.

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  purpose text not null check (purpose in ('listing', 'reactivation', 'addon')),
  amount_paise int not null check (amount_paise >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  provider_ref text,
  created_at timestamptz not null default now()
);

create index payments_listing_id_idx on public.payments (listing_id);

alter table public.payments enable row level security;

create policy "owners read own listing payments"
  on public.payments for select
  to authenticated
  using (exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()));

create policy "owners create pending payments"
  on public.payments for insert
  to authenticated
  with check (
    status = 'pending' -- only the service-role webhook ever sets status='paid'
    and exists (select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid())
  );

-- ============================================================
-- REFERRAL NETWORK
-- ============================================================

create table public.referral_activity (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  credits int not null,
  created_at timestamptz not null default now()
);

create index referral_activity_referrer_id_idx on public.referral_activity (referrer_id);

alter table public.referral_activity enable row level security;

create policy "referrers read own activity"
  on public.referral_activity for select
  to authenticated
  using ((select auth.uid()) = referrer_id);

-- inserts only ever happen via the payment-confirmation service-role path.

create table public.credit_rules (
  action text primary key,
  credits int not null
);

alter table public.credit_rules enable row level security;

create policy "anyone reads credit rules"
  on public.credit_rules for select
  to anon, authenticated
  using (true);

create policy "admins write credit rules"
  on public.credit_rules for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create table public.reward_tiers (
  id int primary key generated always as identity,
  credits_threshold int not null,
  voucher_amount_paise int not null
);

alter table public.reward_tiers enable row level security;

create policy "anyone reads reward tiers"
  on public.reward_tiers for select
  to anon, authenticated
  using (true);

create policy "admins write reward tiers"
  on public.reward_tiers for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create table public.promotions (
  id int primary key default 1 check (id = 1), -- singleton row
  mode text not null check (mode in ('flat', 'multiplier', 'free-listing')),
  flat_amount_paise int,
  multiplier numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false
);

alter table public.promotions enable row level security;

create policy "anyone reads promotions"
  on public.promotions for select
  to anon, authenticated
  using (true);

create policy "admins write promotions"
  on public.promotions for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create table public.voucher_providers (
  id text primary key,
  name text not null,
  connected boolean not null default false,
  credential_ref text, -- Vault secret name, never the key itself
  gst_note text
);

alter table public.voucher_providers enable row level security;

create policy "admins manage voucher providers"
  on public.voucher_providers for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create table public.reward_history (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  provider_id text references public.voucher_providers (id),
  amount_paise int not null,
  issued_at timestamptz not null default now()
);

alter table public.reward_history enable row level security;

create policy "referrers read own reward history"
  on public.reward_history for select
  to authenticated
  using ((select auth.uid()) = referrer_id);

-- ============================================================
-- ADMIN
-- ============================================================

create table public.listing_type_settings (
  type text primary key check (type in ('business', 'equipment', 'lease', 'inventory')),
  active_days int not null,
  archive_days int not null,
  listing_fee_paise int not null,
  reactivation_fee_paise int not null
);

alter table public.listing_type_settings enable row level security;

create policy "anyone reads listing type settings"
  on public.listing_type_settings for select
  to anon, authenticated
  using (true);

create policy "admins write listing type settings"
  on public.listing_type_settings for all
  to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================================
-- RATE LIMIT ON CONTACT REVEAL — see AUDIT.md finding #3
-- ============================================================

create table public.rate_limits (
  key text primary key, -- e.g. 'reveal_seller_contact:<uid>:<yyyy-mm-dd-hh-mm>'
  count int not null default 1,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
-- no client policies — only ever touched by security-definer functions.

create function public.reveal_seller_contact(p_listing_id uuid)
returns text as $$
declare
  v_uid uuid := auth.uid();
  v_verified timestamptz;
  v_phone text;
  v_key text := 'reveal_seller_contact:' || v_uid || ':' || to_char(now(), 'YYYY-MM-DD-HH24-MI');
  v_count int;
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;

  select digilocker_verified_at into v_verified from public.profiles where id = v_uid;
  if v_verified is null then
    raise exception 'buyer is not DigiLocker-verified' using errcode = '42501';
  end if;

  insert into public.rate_limits (key) values (v_key)
    on conflict (key) do update set count = public.rate_limits.count + 1
    returning count into v_count;
  if v_count > 20 then -- 20 reveals/minute/buyer
    raise exception 'rate limit exceeded, try again shortly' using errcode = '42901';
  end if;

  select p.phone into v_phone
  from public.listings l join public.profiles p on p.id = l.owner_id
  where l.id = p_listing_id and l.status = 'active';

  if v_phone is null then
    raise exception 'listing not found';
  end if;

  insert into public.connect_requests (listing_id, buyer_id) values (p_listing_id, v_uid);

  return v_phone;
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function public.reveal_seller_contact(uuid) from public;
grant execute on function public.reveal_seller_contact(uuid) to authenticated;
