import { AdminDashboardClient } from "@/components/admin/dashboard-client";
import { getDashboardData } from "@/lib/data";

export default async function AdminPage() {
  const data = await getDashboardData();
  return <AdminDashboardClient initialData={data} />;
}
