import { AdminApp } from "@/components/admin/AdminApp";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminApp adminEmail={user?.email ?? ""} />;
}
