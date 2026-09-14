-- Called only by the Razorpay webhook route via the service-role client, after
-- signature verification. Not granted to anon/authenticated -- the service role
-- bypasses grants entirely, so no explicit grant/revoke is needed here (unlike
-- reveal_seller_contact, which is meant to be called by authenticated users).
--
-- Atomic: flips payments.status and listings.status/active_until together, so a
-- partial failure can't leave a payment marked paid while the listing stays
-- inactive (or the reverse). Returns true only if a matching pending payment
-- was actually found and activated -- false is the correct, expected response
-- for a webhook Razorpay sends about an order this app never created (e.g.
-- Razorpay's own test-webhook button), not an error.
create function public.activate_listing_from_payment(p_provider_ref text)
returns boolean as $$
declare
  v_payment record;
  v_active_days int;
begin
  select * into v_payment
  from public.payments
  where provider_ref = p_provider_ref and status = 'pending'
  for update;

  if not found then
    return false;
  end if;

  update public.payments
  set status = 'paid'
  where id = v_payment.id;

  select active_days into v_active_days
  from public.listing_type_settings
  where type = (select type from public.listings where id = v_payment.listing_id);

  update public.listings
  set status = 'active',
      active_until = now() + make_interval(days => coalesce(v_active_days, 60))
  where id = v_payment.listing_id;

  return true;
end;
$$ language plpgsql security definer set search_path = public;
