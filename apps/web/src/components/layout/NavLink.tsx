"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  return (
    <Link href={href} className={`${className} ${isCurrent ? "current" : ""}`.trim()}>
      {children}
    </Link>
  );
}
