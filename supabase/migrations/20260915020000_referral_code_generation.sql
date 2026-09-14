-- Real referral-code generation. Until now `profiles.referral_code` was a column with
-- nowhere writing to it -- the UI showed the same hardcoded fake code ("AGL-REF-7F42",
-- src/data/referral.ts) to every visitor. Same security-definer + auth.uid() pattern as
-- reveal_seller_contact(): callable only by a signed-in user, only for their own row.
create function public.get_or_create_referral_code()
returns text as $$
declare
  v_uid uuid := auth.uid();
  v_existing text;
  v_new text;
  v_attempt int := 0;
  -- excludes 0/O/1/I/L -- characters easy to misread when a code is read aloud or typed by hand
  v_alphabet text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;

  select referral_code into v_existing from public.profiles where id = v_uid;
  if v_existing is not null then
    return v_existing; -- idempotent: calling this again just returns the code you already have
  end if;

  loop
    v_attempt := v_attempt + 1;
    if v_attempt > 10 then
      raise exception 'could not generate a unique referral code, try again';
    end if;

    v_new := 'AGL-' || (
      select string_agg(substr(v_alphabet, (floor(random() * length(v_alphabet)) + 1)::int, 1), '')
      from generate_series(1, 6)
    );

    begin
      update public.profiles set referral_code = v_new where id = v_uid;
      return v_new;
    exception when unique_violation then
      -- collision against another user's code -- loop and try a different one
    end;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function public.get_or_create_referral_code() from public;
grant execute on function public.get_or_create_referral_code() to authenticated;
