"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Mail, Settings, X } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/contact", label: "Enquiries", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-adm-sidebar text-white shadow-adm-md transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-6 py-7">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/85">VeBlyss</div>
          <div className="mt-1 text-xl" style={{ fontFamily: "var(--adm-font-head)" }}>
            Admin
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-adm-sm p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 px-3.5 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-adm-sm px-3.5 py-2.5 text-sm transition-colors",
                active ? "bg-adm-sidebar-active font-medium text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={17} className={active ? "text-white" : "text-white/60"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
