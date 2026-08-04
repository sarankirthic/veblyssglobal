"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/contact", label: "Enquiries", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-adm-navy text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-adm-gold">VeBlyss</div>
        <div className="mt-1 text-lg" style={{ fontFamily: "var(--adm-font-head)" }}>
          Admin
        </div>
      </div>
      <nav className="px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "mb-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
