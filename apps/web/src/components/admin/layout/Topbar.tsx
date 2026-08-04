"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin/auth";
import { Badge } from "@/components/admin/ui/Badge";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-adm-hairline bg-white px-8 py-4">
      <div className="font-mono text-xs uppercase tracking-wider text-adm-muted">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">{user.name}</span>
          <Badge tone="gold">{user.role}</Badge>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace("/admin/login");
            }}
            className="flex items-center gap-1.5 text-xs text-adm-muted hover:text-adm-danger"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}
