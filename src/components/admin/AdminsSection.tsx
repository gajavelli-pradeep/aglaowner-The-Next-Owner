import { InviteAdminCard } from "@/components/admin/InviteAdminCard";

/** #sec-admins — the only place a new admin account gets created; /admin/login itself is always email+password, never self-service. */
export function AdminsSection() {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Admins</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">Invite a new admin — the only way an admin account is ever created</p>
        </div>
      </div>
      <InviteAdminCard />
    </div>
  );
}
