import { RequireAuth } from "@/components/admin/layout/RequireAuth";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Topbar } from "@/components/admin/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
