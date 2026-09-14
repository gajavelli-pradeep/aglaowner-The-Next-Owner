-- Fixes replace_reward_tiers() (20260915000000): the unqualified `delete from
-- public.reward_tiers;` tripped Postgres/Supabase's DELETE-without-WHERE safety guard
-- ("DELETE requires a WHERE clause") on every call -- add `where true` to make the
-- intent (delete every row) explicit and satisfy the guard.
create or replace function public.replace_reward_tiers(p_rows jsonb)
returns void as $$
begin
  delete from public.reward_tiers where true;
  insert into public.reward_tiers (credits_threshold, voucher_amount_paise)
  select (elem->>'credits_threshold')::int, (elem->>'voucher_amount_paise')::int
  from jsonb_array_elements(p_rows) as elem;
end;
$$ language plpgsql set search_path = public;

-- Re-assert explicitly: verified live that an anon-key call reached this function's
-- body (it hit the DELETE guard above, same as a service-role call) instead of being
-- rejected with a permission error -- re-running these two statements in case the
-- CREATE OR REPLACE above reset the function's privileges to the default (PUBLIC
-- execute), which is exactly what CREATE OR REPLACE does unless grants are re-stated.
revoke execute on function public.replace_reward_tiers(jsonb) from public;
grant execute on function public.replace_reward_tiers(jsonb) to service_role;
