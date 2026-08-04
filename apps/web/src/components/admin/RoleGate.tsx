"use client";

import { useAuth } from "@/lib/admin/auth";
import type { Role } from "@/lib/types";

export function RoleGate({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) return null;
  return <>{children}</>;
}
