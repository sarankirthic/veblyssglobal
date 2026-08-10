"use client";

import { Calendar, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/admin/auth";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user?.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="flex items-center justify-between bg-adm-header px-5 py-4 shadow-adm-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="-ml-1.5 rounded-adm-sm p-1.5 text-adm-primary hover:bg-adm-neutral-light lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-1.5 rounded-full border border-adm-hairline bg-adm-neutral-light px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-adm-primary/70 max-sm:hidden">
          <Calendar size={12} strokeWidth={2.25} />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-adm-hairline bg-adm-neutral-light py-1.5 pl-1.5 pr-3.5 max-sm:hidden">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-adm-primary font-adm-head text-[11px] font-semibold text-white">
              {initials}
            </span>
            <span className="text-sm font-semibold tracking-tight text-adm-ink">{user.name}</span>
          </div>
          <Badge tone="gold">{user.role}</Badge>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={async () => {
              await logout();
              router.replace("/admin/login");
            }}
            className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-adm-danger/15"
          >
            <LogOut size={13} /> <span className="max-sm:hidden">Sign out</span>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
