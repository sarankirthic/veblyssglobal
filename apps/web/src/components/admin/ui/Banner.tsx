import { cn } from "@/lib/cn";

export function Banner({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-adm-sm border px-4 py-3 text-sm",
        tone === "danger"
          ? "border-adm-danger/20 bg-adm-danger/5 text-adm-danger"
          : "border-adm-success/20 bg-adm-success/5 text-adm-success"
      )}
    >
      {children}
    </div>
  );
}
