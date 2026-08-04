import type { Metadata } from "next";
import { AuthProvider } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "VeBlyss Admin",
  description: "Content and metrics admin panel for VeBlyss Global.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-app">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
