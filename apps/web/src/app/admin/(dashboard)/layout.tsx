import { RequireAuth } from "@/components/admin/layout/RequireAuth";
import { AdminShell } from "@/components/admin/layout/AdminShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
