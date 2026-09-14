-- Fixes a data-loss bug flagged by code review: the admin "Save milestones" action
-- was doing delete() then a separate insert() from the app, with no transaction --
-- if the insert failed after the delete succeeded, reward_tiers was left empty with
-- no rollback. One function call is one transaction, so this is atomic by construction.
create function public.replace_reward_tiers(p_rows jsonb)
returns void as $$
begin
  delete from public.reward_tiers;
  insert into public.reward_tiers (credits_threshold, voucher_amount_paise)
  select (elem->>'credits_threshold')::int, (elem->>'voucher_amount_paise')::int
  from jsonb_array_elements(p_rows) as elem;
end;
$$ language plpgsql set search_path = public;

-- Not security definer -- it runs with the caller's own privileges. Only ever called
-- from POST /api/admin/reward-rules/tiers via the service-role client, which already
-- bypasses RLS; explicitly restricting execute to service_role stops it being callable
-- directly over PostgREST by any anon/authenticated client, bypassing that route's
-- own admin check.
revoke execute on function public.replace_reward_tiers(jsonb) from public;
grant execute on function public.replace_reward_tiers(jsonb) to service_role;
