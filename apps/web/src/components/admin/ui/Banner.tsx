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
        "border px-4 py-3 text-sm",
        tone === "danger"
          ? "border-adm-danger/30 bg-adm-danger/5 text-adm-danger"
          : "border-adm-success/30 bg-adm-success/5 text-adm-success"
      )}
    >
      {children}
    </div>
  );
}
